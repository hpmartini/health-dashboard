'use client'

import { useState } from 'react'

interface Meal {
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface DailyData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: Meal[]
}

interface UserGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  targetWeight: number
  currentWeight: number
}

// Demo data - will be replaced with API
const demoData: DailyData = {
  date: new Date().toISOString().split('T')[0],
  calories: 1767,
  protein: 81,
  carbs: 159,
  fat: 72,
  meals: [
    { time: '08:35', name: 'Rote Wurst', calories: 84, protein: 3.6, carbs: 0, fat: 7.8 },
    { time: '12:23', name: 'Joghurt & Müsli', calories: 398, protein: 14, carbs: 55, fat: 14 },
    { time: '15:50', name: 'Curry-Eintopf', calories: 950, protein: 27, carbs: 95, fat: 42 },
    { time: '19:22', name: 'Protein Shake', calories: 335, protein: 36.5, carbs: 8.5, fat: 15.6 },
  ]
}

const userGoals: UserGoals = {
  calories: 2000,
  protein: 150,
  carbs: 180,
  fat: 60,
  targetWeight: 70,
  currentWeight: 78
}

// Progress Ring Component
function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = '#22c55e',
  bgColor = 'rgba(255,255,255,0.1)'
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference

  return (
    <svg className="progress-ring" width={size} height={size}>
      <circle
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
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

// Macro Card Component
function MacroCard({ 
  label, 
  current, 
  goal, 
  unit = 'g',
  color,
  gradient,
  icon
}: {
  label: string
  current: number
  goal: number
  unit?: string
  color: string
  gradient: string
  icon: string
}) {
  const progress = (current / goal) * 100
  const remaining = goal - current
  const isOver = remaining < 0
  const isLow = progress < 50 && label === 'Protein'

  return (
    <div className={`glass-card ${gradient} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-gray-300 font-medium">{label}</h3>
        </div>
        {isLow && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full animate-pulse-soft">
            ⚠️ Niedrig
          </span>
        )}
        {isOver && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Über Limit
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <ProgressRing 
            progress={progress} 
            color={isOver ? '#ef4444' : color}
            size={100}
            strokeWidth={10}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-3xl font-bold mb-1">
            {current.toFixed(label === 'Kalorien' ? 0 : 1)}{unit}
          </div>
          <div className="text-gray-500 text-sm mb-2">von {goal}{unit}</div>
          <div className={`text-lg font-medium ${isOver ? 'text-red-400' : 'text-gray-300'}`}>
            {isOver ? '' : '+'}{remaining.toFixed(label === 'Kalorien' ? 0 : 0)}{unit} übrig
          </div>
        </div>
      </div>
    </div>
  )
}

// Weight Card Component
function WeightCard({ current, target }: { current: number; target: number }) {
  const toGo = current - target
  const progressFromStart = ((78 - current) / (78 - target)) * 100

  return (
    <div className="glass-card gradient-weight rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">⚖️</span>
        <h3 className="text-gray-300 font-medium">Gewicht</h3>
      </div>
      
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-5xl font-bold">{current}</span>
          <span className="text-2xl text-gray-500 ml-1">kg</span>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Ziel</div>
          <div className="text-2xl font-semibold text-purple-400">{target} kg</div>
        </div>
      </div>
      
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(progressFromStart, 100))}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Start: 78 kg</span>
        <span className="text-purple-400 font-medium">Noch {toGo} kg</span>
      </div>
    </div>
  )
}

// Meal Item Component
function MealItem({ meal, index }: { meal: Meal; index: number }) {
  return (
    <div 
      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-16 text-center">
        <div className="text-xs text-gray-500 uppercase">Zeit</div>
        <div className="text-lg font-mono font-semibold text-gray-300">{meal.time}</div>
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-white">{meal.name}</div>
        <div className="text-sm text-gray-500">
          {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-xl font-bold text-white">{meal.calories}</div>
        <div className="text-xs text-gray-500">kcal</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data] = useState<DailyData>(demoData)
  const [goals] = useState<UserGoals>(userGoals)

  const remaining = {
    calories: goals.calories - data.calories,
    protein: goals.protein - data.protein,
    carbs: goals.carbs - data.carbs,
    fat: goals.fat - data.fat
  }

  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl animate-float">🏋️</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {new Date().toLocaleDateString('de-DE', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </header>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MacroCard
            label="Kalorien"
            current={data.calories}
            goal={goals.calories}
            unit=" kcal"
            color="#22c55e"
            gradient="gradient-calories"
            icon="🔥"
          />
          <MacroCard
            label="Protein"
            current={data.protein}
            goal={goals.protein}
            color="#3b82f6"
            gradient="gradient-protein"
            icon="💪"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🍞</div>
            <div className="text-sm text-gray-400 mb-1">Carbs</div>
            <div className="text-2xl font-bold">{data.carbs}g</div>
            <div className="text-sm text-gray-500">von {goals.carbs}g</div>
            <div className={`text-sm mt-1 ${remaining.carbs < 0 ? 'text-red-400' : 'text-orange-400'}`}>
              {remaining.carbs > 0 ? '+' : ''}{remaining.carbs.toFixed(0)}g übrig
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🧈</div>
            <div className="text-sm text-gray-400 mb-1">Fett</div>
            <div className="text-2xl font-bold">{data.fat}g</div>
            <div className="text-sm text-gray-500">von {goals.fat}g</div>
            <div className={`text-sm mt-1 ${remaining.fat < 0 ? 'text-red-400' : 'text-pink-400'}`}>
              {remaining.fat > 0 ? '+' : ''}{remaining.fat.toFixed(0)}g übrig
            </div>
          </div>
          
          <WeightCard current={goals.currentWeight} target={goals.targetWeight} />
        </div>

        {/* Meals Section */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🍽️</span>
            <h2 className="text-xl font-semibold">Mahlzeiten heute</h2>
            <span className="ml-auto text-gray-500 text-sm">{data.meals.length} Einträge</span>
          </div>
          
          <div className="space-y-3">
            {data.meals.map((meal, i) => (
              <MealItem key={i} meal={meal} index={i} />
            ))}
          </div>
          
          {data.meals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl mb-4 block">🍽️</span>
              Noch keine Mahlzeiten eingetragen
            </div>
          )}
        </div>

        {/* Daily Summary */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-semibold">Tagesbudget Übersicht</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className={`text-3xl font-bold ${remaining.calories < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {remaining.calories > 0 ? '+' : ''}{remaining.calories}
              </div>
              <div className="text-gray-400 text-sm mt-1">kcal übrig</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className={`text-3xl font-bold ${remaining.protein > 50 ? 'text-yellow-400' : remaining.protein < 0 ? 'text-red-400' : 'text-blue-400'}`}>
                {remaining.protein > 0 ? '+' : ''}{remaining.protein.toFixed(0)}g
              </div>
              <div className="text-gray-400 text-sm mt-1">Protein übrig</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className={`text-3xl font-bold ${remaining.carbs < 0 ? 'text-red-400' : 'text-orange-400'}`}>
                {remaining.carbs > 0 ? '+' : ''}{remaining.carbs.toFixed(0)}g
              </div>
              <div className="text-gray-400 text-sm mt-1">Carbs übrig</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className={`text-3xl font-bold ${remaining.fat < 0 ? 'text-red-400' : 'text-pink-400'}`}>
                {remaining.fat > 0 ? '+' : ''}{remaining.fat.toFixed(0)}g
              </div>
              <div className="text-gray-400 text-sm mt-1">Fett übrig</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Health Dashboard • Powered by <span className="text-purple-400">dangerPete</span> 🤖
          </p>
        </footer>
      </div>
    </main>
  )
}
