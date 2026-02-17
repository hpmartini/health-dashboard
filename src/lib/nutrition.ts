import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Base path configurable via env var for Coolify volume mount
const DATA_BASE_PATH = process.env.DATA_PATH || '/home/node/openclaw';
const MEMORY_DIR = join(DATA_BASE_PATH, 'memory');
const NUTRITION_DIR = join(DATA_BASE_PATH, 'nutrition/daily');

export interface Meal {
  id: number;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  macros: string;
}

export interface NutritionData {
  date: string;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weightTarget: number;
    currentWeight: number;
  };
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  weight: {
    current: number;
    target: number;
  };
}

// Parse USER.md for targets (could be enhanced)
function parseUserTargets() {
  return {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 70,
    weightTarget: 70,
    currentWeight: 78
  };
}

// Parse nutrition from the dedicated nutrition log format
function parseNutritionLog(date: string): { meals: Meal[], totals: any } | null {
  const [year, month] = date.split('-');
  const filepath = join(NUTRITION_DIR, `${year}-${month}`, `${date}.md`);
  
  if (!existsSync(filepath)) {
    return null;
  }
  
  const content = readFileSync(filepath, 'utf-8');
  const meals: Meal[] = [];
  let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  
  // Parse table rows: | Item | kcal | P | C | F |
  // Look for meal sections with times: ## Frühstück — 09:24
  const sections = content.split(/^##\s+/m).slice(1);
  
  for (const section of sections) {
    // Extract meal type and time
    const headerMatch = section.match(/^([^—\n]+)(?:\s*—\s*(\d{1,2}:\d{2}))?/);
    if (!headerMatch) continue;
    
    const mealType = headerMatch[1].trim();
    const mealTime = headerMatch[2] || '00:00';
    
    // Skip non-meal sections
    if (mealType.includes('Tagesbilanz') || mealType.includes('Tagesziel')) continue;
    
    // Find the summary line: **Summe Frühstück: 619 kcal | 25g P | 82g C | 21g F**
    const sumMatch = section.match(/\*\*Summe[^:]*:\s*(\d+)\s*kcal\s*\|\s*(\d+)g?\s*P\s*\|\s*(\d+)g?\s*C\s*\|\s*(\d+)g?\s*F\*\*/i);
    
    if (sumMatch) {
      const cals = parseInt(sumMatch[1]) || 0;
      const protein = parseInt(sumMatch[2]) || 0;
      const carbs = parseInt(sumMatch[3]) || 0;
      const fat = parseInt(sumMatch[4]) || 0;
      
      meals.push({
        id: meals.length + 1,
        name: mealType,
        time: mealTime,
        calories: cals,
        protein: protein,
        carbs: carbs,
        fat: fat,
        macros: `${protein}g P • ${carbs}g KH • ${fat}g F`
      });
      
      totalCals += cals;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    }
  }
  
  if (meals.length === 0) return null;
  
  return {
    meals,
    totals: {
      calories: totalCals,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat
    }
  };
}

// Parse memory file for nutrition data (legacy/fallback)
function parseMemoryFile(date: string): { meals: Meal[], totals: any } | null {
  const filepath = join(MEMORY_DIR, `${date}.md`);
  
  if (!existsSync(filepath)) {
    return null;
  }
  
  const content = readFileSync(filepath, 'utf-8');
  const meals: Meal[] = [];
  let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  
  // Match various meal entry formats
  const patterns = [
    // "### Frühstück — 09:24" followed by summary
    /###?\s*([^—\n]+)\s*—\s*(\d{1,2}:\d{2})[^*]*\*\*(\d+)\s*kcal\s*\|\s*(\d+)g?\s*P\s*\|\s*(\d+)g?\s*C\s*\|\s*(\d+)g?\s*F\*\*/gi,
    // "- **Snack ~08:35:** ... — 84 kcal | 3.6g P | 0g C | 7.8g F"
    /[-*]\s*\*\*([^*]+)\s*[~]?(\d{1,2}:\d{2})[^*]*\*\*:?\s*([^—\n]*)—?\s*~?(\d+)\s*kcal\s*\|\s*([\d.]+)g?\s*P\s*\|\s*([\d.]+)g?\s*(?:C|KH)\s*\|\s*([\d.]+)g?\s*F/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const cals = parseInt(match[4] || match[3]) || 0;
      const protein = parseFloat(match[5] || match[4]) || 0;
      const carbs = parseFloat(match[6] || match[5]) || 0;
      const fat = parseFloat(match[7] || match[6]) || 0;
      
      // Avoid duplicates
      const time = match[2];
      if (meals.some(m => m.time === time)) continue;
      
      meals.push({
        id: meals.length + 1,
        name: (match[1] || 'Mahlzeit').trim(),
        time: time,
        calories: cals,
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        macros: `${Math.round(protein)}g P • ${Math.round(carbs)}g KH • ${Math.round(fat)}g F`
      });
      
      totalCals += cals;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    }
  }
  
  if (meals.length === 0) return null;
  
  meals.sort((a, b) => a.time.localeCompare(b.time));
  
  return {
    meals,
    totals: {
      calories: Math.round(totalCals),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat)
    }
  };
}

export function getNutritionData(date: string): NutritionData {
  const targets = parseUserTargets();
  
  // Try nutrition log first, then memory file
  const nutritionLog = parseNutritionLog(date);
  const memoryData = parseMemoryFile(date);
  
  // Merge data from both sources, preferring nutrition log
  let meals: Meal[] = [];
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  if (nutritionLog) {
    meals = [...nutritionLog.meals];
    totals = { ...nutritionLog.totals };
  }
  
  if (memoryData) {
    // Add meals from memory that aren't already in nutrition log
    for (const meal of memoryData.meals) {
      if (!meals.some(m => m.time === meal.time)) {
        meals.push(meal);
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
      }
    }
  }
  
  meals.sort((a, b) => a.time.localeCompare(b.time));
  
  return {
    date,
    targets,
    totals,
    meals,
    weight: {
      current: targets.currentWeight,
      target: targets.weightTarget
    }
  };
}
