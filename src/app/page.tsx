"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Droplets, 
  Wheat, 
  Dna, 
  Scale, 
  ChevronRight, 
  Utensils, 
  Calendar,
  Activity,
  Target
} from "lucide-react";

// --- Utility Components ---

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// --- Visual Components ---

/**
 * Reusable Glass Card Component
 */
const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900/70 hover:border-white/20 hover:shadow-2xl shadow-black/50",
    className
  )}>
    {/* Subtle internal noise/gradient for texture */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
    <div className="relative z-10">{children}</div>
  </div>
);

/**
 * Animated Progress Ring Component
 */
const ProgressRing = ({ 
  radius, 
  stroke, 
  progress, 
  colorStart, 
  colorEnd, 
  icon: Icon,
  bgStroke = "stroke-white/10"
}: { 
  radius: number; 
  stroke: number; 
  progress: number; 
  colorStart: string; 
  colorEnd: string;
  icon: React.ElementType;
  bgStroke?: string;
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Cap progress visually at 100% for the ring, but logic handles overflow elsewhere
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;
  const isOverLimit = progress > 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] transition-all duration-500"
      >
        {/* Background Ring */}
        <circle
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={bgStroke}
        />
        {/* Defs for Gradient */}
        <defs>
          <linearGradient id={`grad-${colorStart}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        {/* Progress Ring */}
        <circle
          strokeWidth={stroke}
          stroke={`url(#grad-${colorStart})`}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", isOverLimit && "animate-pulse")}
        />
      </svg>
      {/* Centered Icon */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <Icon size={24} className="text-white/90 drop-shadow-md" />
      </div>
    </div>
  );
};

// --- Page Component ---

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState("Tag");

  // Mock Data from original screenshot
  const tabs = ["Tag", "Woche", "Monat", "Jahr"];
  
  const macros = [
    {
      label: "Kalorien",
      current: 1767,
      target: 2000,
      unit: "kcal",
      remaining: 233,
      remainingLabel: "übrig",
      percent: 88,
      colorStart: "#10b981", // Emerald 500
      colorEnd: "#34d399",   // Emerald 400
      icon: Flame,
      status: "normal"
    },
    {
      label: "Protein",
      current: 81,
      target: 150,
      unit: "g",
      remaining: 69,
      remainingLabel: "übrig",
      percent: 54,
      colorStart: "#3b82f6", // Blue 500
      colorEnd: "#60a5fa",   // Blue 400
      icon: Dna,
      status: "normal"
    },
    {
      label: "Kohlenhydrate",
      current: 159,
      target: 180,
      unit: "g",
      remaining: 21,
      remainingLabel: "übrig",
      percent: 88,
      colorStart: "#f59e0b", // Amber 500
      colorEnd: "#fbbf24",   // Amber 400
      icon: Wheat,
      status: "normal"
    },
    {
      label: "Fett",
      current: 72,
      target: 60,
      unit: "g",
      remaining: 12,
      remainingLabel: "über",
      percent: 120,
      colorStart: "#ef4444", // Red 500
      colorEnd: "#f87171",   // Red 400
      icon: Droplets,
      status: "warning"
    }
  ];

  const meals = [
    {
      id: 1,
      name: "Rote Wurst",
      time: "08:35",
      macros: "3.6g P • 0g KH • 7.8g F",
      cals: 84
    },
    {
      id: 2,
      name: "Joghurt & Müsli",
      time: "12:23",
      macros: "14g P • 55g KH • 14g F",
      cals: 320
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-teal-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col items-center space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur-md">
            <Calendar size={12} />
            <span>Montag, 16. Februar 2026</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Health Dashboard
          </h1>
        </header>

        {/* Custom Segmented Control / Tabs */}
        <nav className="flex w-full rounded-2xl bg-zinc-900/80 p-1.5 backdrop-blur-md ring-1 ring-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300",
                activeTab === tab
                  ? "bg-zinc-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Macros Grid */}
        <div className="grid grid-cols-2 gap-4">
          {macros.map((macro, idx) => (
            <GlassCard key={idx} className="flex flex-col items-center justify-between gap-4 p-5">
              <div className="flex w-full items-start justify-between">
                <span className="text-sm font-medium text-zinc-400">{macro.label}</span>
                <span className={cn("text-xs font-bold", macro.status === "warning" ? "text-red-400" : "text-zinc-500")}>
                  {macro.percent}%
                </span>
              </div>
              
              <ProgressRing 
                radius={50} 
                stroke={8} 
                progress={macro.percent} 
                colorStart={macro.colorStart}
                colorEnd={macro.colorEnd}
                icon={macro.icon}
                bgStroke={macro.status === "warning" ? "stroke-red-900/20" : "stroke-white/5"}
              />

              <div className="text-center space-y-0.5">
                <div className="text-xl font-bold tracking-tight">
                  <span className={cn(macro.status === "warning" && "text-red-400")}>{macro.current}</span>
                  <span className="text-zinc-600 text-base"> / {macro.target}</span>
                  <span className="text-xs text-zinc-500 ml-0.5">{macro.unit}</span>
                </div>
                <div className={cn("text-xs font-medium", macro.status === "warning" ? "text-red-400/80" : "text-emerald-400/80")}>
                  {macro.remaining} {macro.unit} {macro.remainingLabel}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Weight Section */}
        <GlassCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                <Scale size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-300">Gewicht</h3>
                <p className="text-xs text-zinc-500">Ziel: 70 kg</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">78<span className="text-sm text-zinc-500 font-normal">kg</span></div>
              <div className="text-xs font-medium text-violet-400">noch 8 kg</div>
            </div>
          </div>
          
          {/* Custom Progress Bar for Weight */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-800/50">
            {/* Target Marker */}
            <div className="absolute right-0 top-0 h-full w-1 bg-violet-500/30 z-10" />
            {/* Progress Fill (Inverted logic slightly for weight loss visual) */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_0_15px_rgba(124,58,237,0.5)]"
              style={{ width: '20%' }}
            />
          </div>
        </GlassCard>

        {/* Meals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-white">Mahlzeiten heute</h2>
            <div className="text-xs font-medium text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-md border border-white/5">
              4 Einträge
            </div>
          </div>

          <div className="space-y-3">
            {meals.map((meal) => (
              <GlassCard key={meal.id} className="flex items-center justify-between p-4 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-800/50 text-zinc-400 ring-1 ring-inset ring-white/5">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-200">{meal.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <span className="font-medium text-zinc-400">{meal.time}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-700" />
                      <span>{meal.macros}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-lg font-bold text-white">{meal.cals}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500">kcal</span>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
