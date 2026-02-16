'use client';

import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState('Tag');

  // Helper for glassmorphism styles to ensure consistency and bypass Tailwind v4 issues
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

  // SVG Circle Component for consistency
  const ProgressRing = ({ percentage, color, icon: Icon, value, label, subtext, subLabel }: any) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
      <div style={glassCardStyle} className="flex flex-col items-center justify-center p-5 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between w-full mb-3 px-1">
          <span style={{ color: '#E4E4E7', fontSize: '15px', fontWeight: 600 }}>{label}</span>
          <span style={{ color: percentage > 100 ? '#EF4444' : '#A1A1AA', fontSize: '13px' }}>{percentage}%</span>
        </div>

        {/* Ring */}
        <div className="relative flex items-center justify-center mb-3">
          <svg width="100" height="100" className="transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Ring */}
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
        <div className="text-center mt-1">
          <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px' }}>
            {value}
          </div>
          <div style={{ color: '#A1A1AA', fontSize: '12px', marginTop: '4px' }}>
            {subtext}
          </div>
          <div style={{ color: color, fontSize: '11px', marginTop: '2px', fontWeight: 500 }}>
            {subLabel}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col font-sans"
      style={{ backgroundColor: '#000000', color: '#fff', paddingBottom: '100px' }}
    >
      {/* Ambient Backgrounds */}
      <div style={ambientGlowStyle} />
      <div style={secondaryGlowStyle} />

      {/* Main Content Container */}
      <main className="relative z-10 p-5 pt-12 max-w-md mx-auto w-full flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col gap-1 items-center mb-2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
             <CalendarDays size={14} className="text-zinc-400" />
             <span className="text-xs font-medium text-zinc-300 uppercase tracking-wide">Montag, 16. Feb</span>
          </div>
          <h1 className="text-3xl font-bold mt-3 tracking-tight text-white drop-shadow-md">Health Dashboard</h1>
        </header>

        {/* Tabs - Segmented Control Style */}
        <div 
          className="grid grid-cols-4 p-1 rounded-xl"
          style={{ backgroundColor: 'rgba(113, 113, 122, 0.25)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {['Tag', 'Woche', 'Monat', 'Jahr'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold py-1.5 rounded-lg transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white shadow-lg scale-[1.02]' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Macro Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ProgressRing 
            label="Kalorien" 
            percentage={88} 
            color="#34D399"
            icon={Flame} 
            value="1767 / 2000"
            subtext="kcal gesamt"
            subLabel="233 übrig"
          />
          <ProgressRing 
            label="Protein" 
            percentage={54} 
            color="#3B82F6"
            icon={Dna} 
            value="81 / 150g"
            subtext="konsumiert"
            subLabel="69g übrig"
          />
          <ProgressRing 
            label="Kohlenhyd." 
            percentage={88} 
            color="#F59E0B"
            icon={Wheat} 
            value="159 / 180g"
            subtext="konsumiert"
            subLabel="21g übrig"
          />
          <ProgressRing 
            label="Fett" 
            percentage={120} 
            color="#EF4444"
            icon={Droplet} 
            value="72 / 60g"
            subtext="konsumiert"
            subLabel="12g drüber"
          />
        </div>

        {/* Weight Card */}
        <div style={glassCardStyle} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                    <Scale size={22} color="#A855F7" />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-lg">Gewicht</h3>
                    <p className="text-zinc-400 text-sm">Ziel: 70 kg</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-white">78<span className="text-base text-zinc-400 ml-0.5">kg</span></div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 inline-block mt-1">
                    noch 8 kg
                </div>
            </div>
        </div>

        {/* Meals Section */}
        <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-xl font-bold text-white">Mahlzeiten heute</h2>
                <span className="text-sm font-medium text-zinc-400">4 Einträge</span>
            </div>

            <div style={glassCardStyle} className="flex flex-col overflow-hidden">
                {/* Meal Item 1 */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 active:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                            <Utensils size={18} className="text-red-400" />
                        </div>
                        <div>
                            <div className="font-medium text-white">Rote Wurst</div>
                            <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                                <span>08:35 Uhr</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                <span className="text-zinc-300">3.6g P • 0g KH • 7.8g F</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-white">84 <span className="text-xs font-normal text-zinc-500">kcal</span></span>
                        <ChevronRight size={16} className="text-zinc-600" />
                    </div>
                </div>

                {/* Meal Item 2 */}
                <div className="p-4 flex items-center justify-between active:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
                            <Utensils size={18} className="text-blue-400" />
                        </div>
                        <div>
                            <div className="font-medium text-white">Joghurt & Müsli</div>
                            <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                                <span>12:23 Uhr</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                <span className="text-zinc-300">14g P • 55g KH • 14g F</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-white">320 <span className="text-xs font-normal text-zinc-500">kcal</span></span>
                        <ChevronRight size={16} className="text-zinc-600" />
                    </div>
                </div>
                
                {/* Add Button inside card */}
                <div className="p-3 bg-white/5 flex justify-center items-center hover:bg-white/10 transition-colors cursor-pointer">
                    <Plus size={20} className="text-zinc-400" />
                </div>
            </div>
        </div>
      </main>

      {/* Floating Action / Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div style={{ ...glassCardStyle, borderRadius: '50px', padding: '8px 20px' }} className="flex items-center gap-6">
            <CalendarDays size={24} className="text-zinc-400" />
            <div className="bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-600/30 -mt-8 border-4 border-black">
                <Plus size={24} color="white" />
            </div>
            <MoreHorizontal size={24} className="text-zinc-400" />
        </div>
      </div>
    </div>
  );
}
