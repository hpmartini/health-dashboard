'use client'

import { useState, useEffect } from 'react'
import { DailyOverview } from '@/components/DailyOverview'
import { MacroChart } from '@/components/MacroChart'
import { WeeklyTrend } from '@/components/WeeklyTrend'
import { Goals } from '@/components/Goals'

interface DailyData {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: Array<{
    time: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
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
  calories: 1432,
  protein: 44.5,
  carbs: 150,
  fat: 56,
  meals: [
    { time: '08:35', name: 'Snack - Rote Wurst', calories: 84, protein: 3.6, carbs: 0, fat: 7.8 },
    { time: '12:23', name: 'Frühstück - Joghurt & Müsli', calories: 398, protein: 14, carbs: 55, fat: 14 },
    { time: '15:50', name: 'Mittagessen - Curry-Eintopf', calories: 950, protein: 27, carbs: 95, fat: 42 },
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

export default function Dashboard() {
  const [data, setData] = useState<DailyData>(demoData)
  const [goals] = useState<UserGoals>(userGoals)

  const remaining = {
    calories: goals.calories - data.calories,
    protein: goals.protein - data.protein,
    carbs: goals.carbs - data.carbs,
    fat: goals.fat - data.fat
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🏋️ Health Dashboard</h1>
        <p className="text-gray-400">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calories Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm mb-2">Kalorien</h3>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">{data.calories}</span>
              <span className="text-gray-500 ml-1">/ {goals.calories}</span>
            </div>
            <span className={`text-lg ${remaining.calories > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {remaining.calories > 0 ? '+' : ''}{remaining.calories} übrig
            </span>
          </div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ width: `${Math.min((data.calories / goals.calories) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm mb-2">Protein</h3>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">{data.protein}g</span>
              <span className="text-gray-500 ml-1">/ {goals.protein}g</span>
            </div>
            <span className={`text-lg ${remaining.protein > 50 ? 'text-yellow-400' : remaining.protein > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {remaining.protein > 0 ? '+' : ''}{remaining.protein.toFixed(1)}g übrig
            </span>
          </div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${data.protein / goals.protein < 0.5 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((data.protein / goals.protein) * 100, 100)}%` }}
            />
          </div>
          {remaining.protein > 50 && (
            <p className="mt-2 text-yellow-400 text-sm">⚠️ Protein niedrig!</p>
          )}
        </div>

        {/* Weight Progress */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-gray-400 text-sm mb-2">Gewicht</h3>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">{goals.currentWeight}</span>
              <span className="text-gray-500 ml-1">kg</span>
            </div>
            <span className="text-lg text-gray-400">
              Ziel: {goals.targetWeight} kg
            </span>
          </div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${((goals.currentWeight - goals.targetWeight) / (78 - goals.targetWeight)) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-gray-400 text-sm">
            Noch {goals.currentWeight - goals.targetWeight} kg bis zum Ziel
          </p>
        </div>
      </div>

      {/* Macros Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Makros heute</h3>
          <MacroChart data={data} goals={goals} />
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Mahlzeiten</h3>
          <div className="space-y-3">
            {data.meals.map((meal, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div>
                  <span className="text-gray-500 text-sm mr-3">{meal.time}</span>
                  <span className="text-white">{meal.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{meal.calories} kcal</span>
                  <span className="text-gray-500 text-sm ml-2">{meal.protein}g P</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remaining Budget */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">📊 Tagesbudget - Was noch übrig ist</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <p className="text-3xl font-bold text-green-400">{remaining.calories}</p>
            <p className="text-gray-400 text-sm">kcal</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <p className={`text-3xl font-bold ${remaining.protein > 50 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {remaining.protein.toFixed(1)}g
            </p>
            <p className="text-gray-400 text-sm">Protein</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <p className={`text-3xl font-bold ${remaining.carbs < 0 ? 'text-red-400' : 'text-orange-400'}`}>
              {remaining.carbs.toFixed(0)}g
            </p>
            <p className="text-gray-400 text-sm">Carbs</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <p className={`text-3xl font-bold ${remaining.fat < 0 ? 'text-red-400' : 'text-pink-400'}`}>
              {remaining.fat.toFixed(0)}g
            </p>
            <p className="text-gray-400 text-sm">Fett</p>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>Health Dashboard • Powered by dangerPete 🤖</p>
      </footer>
    </main>
  )
}
