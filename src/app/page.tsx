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
  MoreHorizontal,
  Plus,
  Loader2
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
    // Adjust for Berlin timezone (UTC+1)
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

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
  };

  // Glassmorphism styles
  const glassCardStyle = {
    backgroundColor: 'rgba(28, 28, 30, 0.65)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.3)',
    borderRadius: '24px',
  };

  const ambientGlowStyle = {
    background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.25), transparent 70%)',
    position: 'fixed' as const,
    top: '-15%',
    left: '-10%',
    width: '120vw',
    height: '60vw',
    minHeight: '600px',
    filter: 'blur(80px)',
    zIndex: 0,
    pointerEvents: 'none' as const,
  };

  const secondaryGlowStyle = {
    background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.15), transparent 60%)',
    position: 'fixed' as const,
    bottom: '-10%',
    right: '-10%',
    width: '100vw',
    height: '600px',
    filter: 'blur(100px)',
    zIndex: 0,
    pointerEvents: 'none' as const,
  };

  // Progress Ring Component
  const ProgressRing = ({ percentage, color, icon: Icon, value, label, subtext, subLabel }: any) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
      <div style={glassCardStyle} className="flex flex-col items-center justify-center p-5 relative overflow-hidden min-h-[210px]">
        {/* Header with proper spacing */}
        <div className="flex justify-between items-center w-full mb-4 px-1">
          <span style={{ color: '#E4E4E7', fontSize: '13px', fontWeight: 600, lineHeight: 1 }}>{label}</span>
          <span style={{ color: percentage > 100 ? '#EF4444' : '#71717A', fontSize: '12px', fontWeight: 500, lineHeight: 1 }}>
            {percentage}%
          </span>
        </div>

        {/* Ring */}
        <div className="relative flex items-center justify-center mb-3">
          <svg width="100" height="100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={24} color={color} strokeWidth={2.5} />
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}>
            {value}
          </div>
          <div style={{ color: '#A1A1AA', fontSize: '11px', marginTop: '4px' }}>
            {subtext}
          </div>
          <div style={{ color: color, fontSize: '11px', marginTop: '2px', fontWeight: 500 }}>
            {subLabel}
          </div>
        </div>
      </div>
    );
  };

  // Calculate percentages and remaining
  const targets = data?.targets || { calories: 2000, protein: 150, carbs: 200, fat: 70 };
  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const weight = data?.weight || { current: 78, target: 70 };

  const calPercent = Math.round((totals.calories / targets.calories) * 100);
  const proteinPercent = Math.round((totals.protein / targets.protein) * 100);
  const carbPercent = Math.round((totals.carbs / targets.carbs) * 100);
  const fatPercent = Math.round((totals.fat / targets.fat) * 100);

  const calRemaining = targets.calories - totals.calories;
  const proteinRemaining = targets.protein - totals.protein;
  const carbRemaining = targets.carbs - totals.carbs;
  const fatRemaining = targets.fat - totals.fat;

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col font-sans"
      style={{ backgroundColor: '#000000', color: '#fff', paddingBottom: '120px' }}
    >
      {/* Ambient Backgrounds */}
      <div style={ambientGlowStyle} />
      <div style={secondaryGlowStyle} />

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-8 pb-8 max-w-md mx-auto w-full flex flex-col gap-5">
        
        {/* Header */}
        <header className="text-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-3">Health Dashboard</h1>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full" 
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <CalendarDays size={14} className="text-zinc-400" />
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wide">
              {formatDate(selectedDate)}
            </span>
          </div>
        </header>

        {/* Tabs */}
        <div 
          className="grid grid-cols-4 p-1 rounded-xl"
          style={{ backgroundColor: 'rgba(113, 113, 122, 0.25)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {['Tag', 'Woche', 'Monat', 'Jahr'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        )}

        {/* Macro Grid */}
        {!loading && (
          <div className="grid grid-cols-2 gap-3">
            <ProgressRing 
              label="Kalorien" 
              percentage={calPercent} 
              color="#34D399"
              icon={Flame} 
              value={`${totals.calories} / ${targets.calories}`}
              subtext="kcal gesamt"
              subLabel={calRemaining >= 0 ? `${calRemaining} übrig` : `${Math.abs(calRemaining)} drüber`}
            />
            <ProgressRing 
              label="Protein" 
              percentage={proteinPercent} 
              color="#3B82F6"
              icon={Dna} 
              value={`${totals.protein} / ${targets.protein}g`}
              subtext="konsumiert"
              subLabel={proteinRemaining >= 0 ? `${proteinRemaining}g übrig` : `${Math.abs(proteinRemaining)}g drüber`}
            />
            <ProgressRing 
              label="Kohlenhydrate" 
              percentage={carbPercent} 
              color="#F59E0B"
              icon={Wheat} 
              value={`${totals.carbs} / ${targets.carbs}g`}
              subtext="konsumiert"
              subLabel={carbRemaining >= 0 ? `${carbRemaining}g übrig` : `${Math.abs(carbRemaining)}g drüber`}
            />
            <ProgressRing 
              label="Fett" 
              percentage={fatPercent} 
              color="#EF4444"
              icon={Droplet} 
              value={`${totals.fat} / ${targets.fat}g`}
              subtext="konsumiert"
              subLabel={fatRemaining >= 0 ? `${fatRemaining}g übrig` : `${Math.abs(fatRemaining)}g drüber`}
            />
          </div>
        )}

        {/* Weight Card */}
        {!loading && (
          <div style={glassCardStyle} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
              >
                <Scale size={22} color="#A855F7" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Gewicht</h3>
                <p className="text-zinc-400 text-sm">Ziel: {weight.target} kg</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {weight.current}<span className="text-base text-zinc-400 ml-0.5">kg</span>
              </div>
              <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 inline-block mt-1">
                noch {weight.current - weight.target} kg
              </div>
            </div>
          </div>
        )}

        {/* Meals Section */}
        {!loading && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-end px-1">
              <h2 className="text-lg font-bold text-white">Mahlzeiten heute</h2>
              <span className="text-sm font-medium text-zinc-400">
                {data?.meals?.length || 0} {(data?.meals?.length || 0) === 1 ? 'Eintrag' : 'Einträge'}
              </span>
            </div>

            <div style={glassCardStyle} className="flex flex-col overflow-hidden">
              {(!data?.meals || data.meals.length === 0) ? (
                <div className="p-6 text-center text-zinc-400">
                  <Utensils size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Noch keine Mahlzeiten erfasst</p>
                </div>
              ) : (
                data.meals.map((meal, idx) => (
                  <div 
                    key={meal.id}
                    className={`p-4 flex items-center justify-between ${
                      idx < data.meals.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                      >
                        <Utensils size={18} className="text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white truncate">{meal.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{meal.time} Uhr</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0"></span>
                          <span className="text-zinc-300 truncate">{meal.macros}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="font-bold text-white">
                        {meal.calories} <span className="text-xs font-normal text-zinc-500">kcal</span>
                      </span>
                      <ChevronRight size={16} className="text-zinc-600" />
                    </div>
                  </div>
                ))
              )}
              
              {/* Add Button */}
              <div className="p-3 bg-white/5 flex justify-center items-center hover:bg-white/10 transition-colors cursor-pointer">
                <Plus size={20} className="text-zinc-400" />
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
