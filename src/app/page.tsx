'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Dna, 
  Wheat, 
  Droplet, 
  Scale, 
  Utensils, 
  ChevronRight, 
  CalendarDays,
  Plus,
  Loader2,
  TrendingDown,
  Activity
} from 'lucide-react';

interface Meal {
  id: number;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  macros: string;
}

interface NutritionData {
  date: string;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
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

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState('Tag');
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const berlinOffset = 1 * 60 * 60 * 1000;
    const berlinTime = new Date(now.getTime() + berlinOffset);
    return berlinTime.toISOString().split('T')[0];
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/nutrition?date=${selectedDate}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to fetch nutrition data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedDate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
  };

  // Components
  const MacroCard = ({ title, current, target, unit, color, icon: Icon, percent }: any) => {
    const remaining = target - current;
    const isOver = remaining < 0;
    
    // Color mapping for Tailwind
    const colorClasses: Record<string, string> = {
      emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    };
    
    const barColors: Record<string, string> = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
    };

    return (
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 p-4 border border-white/5 backdrop-blur-xl transition-all active:scale-[0.98]">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{title}</div>
            <div className={`text-xs font-medium ${isOver ? 'text-rose-400' : 'text-zinc-400'}`}>
              {Math.abs(remaining)}{unit} {isOver ? 'drüber' : 'übrig'}
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-2xl font-bold text-white tracking-tight">{current}</span>
          <span className="text-sm text-zinc-500 font-medium mb-1">/ {target}{unit}</span>
        </div>
        
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${barColors[color]} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const targets = data?.targets || { calories: 2000, protein: 150, carbs: 200, fat: 70 };
  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const weight = data?.weight || { current: 78, target: 70 };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30 pb-safe">
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-rose-600/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Health Dashboard</h1>
            <p className="text-sm text-zinc-400">Übersicht deiner Ziele</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors">
            <CalendarDays size={14} className="text-indigo-400" />
            <span className="text-xs font-medium text-zinc-300">{formatDate(selectedDate)}</span>
          </button>
        </header>

        {/* Tab Switcher */}
        <div className="p-1 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/5 grid grid-cols-4 gap-1">
          {['Tag', 'Woche', 'Monat', 'Jahr'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-sm text-zinc-500">Lade Daten...</p>
          </div>
        ) : (
          <>
            {/* Weight Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/60 p-5 border border-white/5 backdrop-blur-xl transition-all active:scale-[0.99]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                    <Scale size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-white">{weight.current}</span>
                      <span className="text-sm text-zinc-500">kg</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <TrendingDown size={12} className="text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">noch {Math.abs(weight.current - weight.target).toFixed(1)} kg</span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">Ziel: {weight.target} kg</span>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                  <ChevronRight size={18} className="text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MacroCard 
                title="Kalorien"
                current={totals.calories}
                target={targets.calories}
                unit=""
                color="emerald"
                icon={Flame}
                percent={(totals.calories / targets.calories) * 100}
              />
              <MacroCard 
                title="Protein"
                current={totals.protein}
                target={targets.protein}
                unit="g"
                color="blue"
                icon={Dna}
                percent={(totals.protein / targets.protein) * 100}
              />
              <MacroCard 
                title="Carbs"
                current={totals.carbs}
                target={targets.carbs}
                unit="g"
                color="amber"
                icon={Wheat}
                percent={(totals.carbs / targets.carbs) * 100}
              />
              <MacroCard 
                title="Fett"
                current={totals.fat}
                target={targets.fat}
                unit="g"
                color="rose"
                icon={Droplet}
                percent={(totals.fat / targets.fat) * 100}
              />
            </div>

            {/* Meals Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-semibold text-zinc-200">Mahlzeiten</h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-white/5 text-[10px] font-medium text-zinc-400">
                  {data?.meals?.length || 0} Einträge
                </span>
              </div>

              <div className="rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl overflow-hidden divide-y divide-white/5">
                {(!data?.meals || data.meals.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                      <Utensils size={20} className="text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">Keine Mahlzeiten</p>
                    <p className="text-xs text-zinc-600 mt-1">Tippe auf +, um zu starten</p>
                  </div>
                ) : (
                  data.meals.map((meal) => (
                    <div key={meal.id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                          <span className="text-lg">🍽️</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-zinc-200 truncate pr-2">{meal.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-zinc-500 font-medium tabular-nums">{meal.time}</span>
                            <span className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
                            <span className="text-xs text-zinc-500 truncate">{meal.macros}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <div className="text-sm font-bold text-white tabular-nums">{meal.calories}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">kcal</div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Add Button */}
                <button className="w-full py-3 flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-xs font-medium text-zinc-400 hover:text-white group">
                  <div className="h-5 w-5 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <Plus size={12} />
                  </div>
                  Eintrag hinzufügen
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
