'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Demo data
const data = {
  date: "16. Februar 2026",
  calories: { current: 1767, goal: 2000 },
  protein: { current: 81, goal: 150 },
  carbs: { current: 159, goal: 180 },
  fat: { current: 72, goal: 60 },
  weight: { current: 78, goal: 70, start: 78 },
  meals: [
    { time: "08:35", name: "Rote Wurst", kcal: 84, p: 3.6, c: 0, f: 7.8 },
    { time: "12:23", name: "Joghurt & Müsli", kcal: 398, p: 14, c: 55, f: 14 },
    { time: "15:50", name: "Curry-Eintopf", kcal: 950, p: 27, c: 95, f: 42 },
    { time: "19:22", name: "Protein Shake", kcal: 335, p: 36.5, c: 8.5, f: 15.6 },
  ]
}

// Circular Progress Component
function CircularProgress({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 10,
  color = "green"
}: { 
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: "green" | "blue" | "amber" | "rose"
}) {
  const percent = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  const colors = {
    green: "url(#gradientGreen)",
    blue: "url(#gradientBlue)",
    amber: "url(#gradientAmber)",
    rose: "url(#gradientRose)"
  }

  return (
    <svg width={size} height={size} className="progress-ring">
      <defs>
        <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.65 0.2 145)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 160)" />
        </linearGradient>
        <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.6 0.2 250)" />
          <stop offset="100%" stopColor="oklch(0.65 0.18 270)" />
        </linearGradient>
        <linearGradient id="gradientAmber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.75 0.18 80)" />
          <stop offset="100%" stopColor="oklch(0.8 0.16 70)" />
        </linearGradient>
        <linearGradient id="gradientRose" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.65 0.22 10)" />
          <stop offset="100%" stopColor="oklch(0.7 0.2 350)" />
        </linearGradient>
      </defs>
      <circle
        stroke="oklch(1 0 0 / 10%)"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={colors[color]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
      />
    </svg>
  )
}

// Linear Progress Bar
function ProgressBar({ 
  value, 
  max, 
  color = "green" 
}: { 
  value: number
  max: number
  color?: "green" | "blue" | "amber" | "rose"
}) {
  const percent = Math.min((value / max) * 100, 100)
  const colorClasses = {
    green: "progress-green",
    blue: "progress-blue", 
    amber: "progress-amber",
    rose: "progress-rose"
  }

  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

// Macro Card Component
function MacroCard({ 
  title, 
  current, 
  goal, 
  unit = "g",
  color,
  delay = 0
}: { 
  title: string
  current: number
  goal: number
  unit?: string
  color: "green" | "blue" | "amber" | "rose"
  delay?: number
}) {
  const remaining = goal - current
  const isOver = remaining < 0
  const isLow = (current / goal) < 0.5 && title === "Protein"

  const gradientClasses = {
    green: "card-gradient-green",
    blue: "card-gradient-blue",
    amber: "card-gradient-amber", 
    rose: "card-gradient-rose"
  }

  const textColors = {
    green: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
    rose: "text-rose-400"
  }

  return (
    <div 
      className={`glass ${gradientClasses[color]} rounded-2xl p-6 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/70">{title}</h3>
        {isLow && (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
            Niedrig
          </span>
        )}
        {isOver && (
          <span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-400">
            Über Limit
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <CircularProgress value={current} max={goal} size={80} strokeWidth={8} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{Math.round((current / goal) * 100)}%</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold tabular-nums ${textColors[color]}`}>
              {current.toFixed(0)}
            </span>
            <span className="text-white/50 text-sm">/ {goal}{unit}</span>
          </div>
          <p className={`text-sm mt-1 ${isOver ? 'text-rose-400' : 'text-white/50'}`}>
            {isOver ? `${Math.abs(remaining).toFixed(0)}${unit} über` : `${remaining.toFixed(0)}${unit} übrig`}
          </p>
        </div>
      </div>
    </div>
  )
}

// Meal Row Component
function MealRow({ meal, index }: { meal: typeof data.meals[0], index: number }) {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${500 + index * 100}ms`, opacity: 0 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <span className="text-xs font-mono text-white/70">{meal.time}</span>
        </div>
        <div>
          <p className="font-medium">{meal.name}</p>
          <p className="text-sm text-white/50">
            {meal.p}g P · {meal.c}g C · {meal.f}g F
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold tabular-nums">{meal.kcal}</p>
        <p className="text-xs text-white/50">kcal</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState("day")
  const { calories, protein, carbs, fat, weight, meals } = data

  return (
    <div className="min-h-screen bg-gradient-animated text-white">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2 animate-fade-in-up" style={{ opacity: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-white/60">Montag, {data.date}</p>
        </header>

        {/* Period Selector */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <Tabs value={period} onValueChange={setPeriod} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl p-1">
              <TabsTrigger 
                value="day" 
                className="rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60 transition-all"
              >
                Tag
              </TabsTrigger>
              <TabsTrigger 
                value="week"
                className="rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60 transition-all"
              >
                Woche
              </TabsTrigger>
              <TabsTrigger 
                value="month"
                className="rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60 transition-all"
              >
                Monat
              </TabsTrigger>
              <TabsTrigger 
                value="year"
                className="rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/60 transition-all"
              >
                Jahr
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Macro Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MacroCard title="Kalorien" current={calories.current} goal={calories.goal} unit=" kcal" color="green" delay={200} />
          <MacroCard title="Protein" current={protein.current} goal={protein.goal} color="blue" delay={300} />
          <MacroCard title="Carbs" current={carbs.current} goal={carbs.goal} color="amber" delay={400} />
          <MacroCard title="Fett" current={fat.current} goal={fat.goal} color="rose" delay={500} />
        </div>

        {/* Weight Card */}
        <div 
          className="glass card-gradient-purple rounded-2xl p-6 animate-fade-in-up"
          style={{ animationDelay: '400ms', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Gewichtsverlauf</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
              -{weight.current - weight.goal} kg to go
            </span>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-4xl font-bold">{weight.current}</span>
              <span className="text-white/50 ml-1">kg</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/50">Ziel</p>
              <p className="text-xl font-semibold text-purple-400">{weight.goal} kg</p>
            </div>
          </div>
          
          <ProgressBar value={weight.start - weight.current} max={weight.start - weight.goal} color="rose" />
          <p className="text-xs text-white/50 mt-2">
            Fortschritt: {weight.current} / {weight.goal} kg
          </p>
        </div>

        {/* Meals Section */}
        <div 
          className="glass rounded-2xl p-6 animate-fade-in-up"
          style={{ animationDelay: '450ms', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Mahlzeiten heute</h3>
            <span className="text-xs text-white/50">{meals.length} Einträge</span>
          </div>
          
          <div className="space-y-3">
            {meals.map((meal, i) => (
              <MealRow key={i} meal={meal} index={i} />
            ))}
          </div>
        </div>

        {/* Summary Bar */}
        <div 
          className="glass rounded-2xl p-4 animate-fade-in-up"
          style={{ animationDelay: '600ms', opacity: 0 }}
        >
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-emerald-400">
                +{calories.goal - calories.current}
              </p>
              <p className="text-xs text-white/50">kcal</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-400">
                +{protein.goal - protein.current}g
              </p>
              <p className="text-xs text-white/50">Protein</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-400">
                +{carbs.goal - carbs.current}g
              </p>
              <p className="text-xs text-white/50">Carbs</p>
            </div>
            <div>
              <p className="text-xl font-bold text-rose-400">
                {fat.goal - fat.current}g
              </p>
              <p className="text-xs text-white/50">Fett</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-white/30 pb-4">
          Health Dashboard • dangerPete
        </footer>
      </div>
    </div>
  )
}
