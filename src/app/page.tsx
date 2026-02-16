'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Demo data
const data = {
  date: "16. Februar 2026",
  calories: { current: 1767, goal: 2000 },
  protein: { current: 81, goal: 150 },
  carbs: { current: 159, goal: 180 },
  fat: { current: 72, goal: 60 },
  weight: { current: 78, goal: 70, start: 78 },
  meals: [
    { time: "08:35", name: "Rote Wurst", kcal: 84, p: 3.6 },
    { time: "12:23", name: "Joghurt & Müsli", kcal: 398, p: 14 },
    { time: "15:50", name: "Curry-Eintopf", kcal: 950, p: 27 },
    { time: "19:22", name: "Protein Shake", kcal: 335, p: 36.5 },
  ]
}

function MacroCard({ 
  title, 
  current, 
  goal, 
  unit = "g",
  color 
}: { 
  title: string
  current: number
  goal: number
  unit?: string
  color: "emerald" | "blue" | "amber" | "rose"
}) {
  const percent = Math.min((current / goal) * 100, 100)
  const remaining = goal - current
  const isOver = remaining < 0
  
  const colorClasses = {
    emerald: "text-emerald-500",
    blue: "text-blue-500", 
    amber: "text-amber-500",
    rose: "text-rose-500"
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold tabular-nums ${colorClasses[color]}`}>
            {current.toFixed(unit === "g" ? 0 : 0)}
          </span>
          <span className="text-muted-foreground text-sm">
            / {goal}{unit}
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className={`text-xs ${isOver ? 'text-rose-500' : 'text-muted-foreground'}`}>
          {isOver ? `${Math.abs(remaining).toFixed(0)}${unit} über Limit` : `${remaining.toFixed(0)}${unit} übrig`}
        </p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { calories, protein, carbs, fat, weight, meals } = data

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Montag, {data.date}
          </p>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MacroCard 
            title="Kalorien" 
            current={calories.current} 
            goal={calories.goal}
            unit=" kcal"
            color="emerald"
          />
          <MacroCard 
            title="Protein" 
            current={protein.current} 
            goal={protein.goal}
            color="blue"
          />
          <MacroCard 
            title="Carbs" 
            current={carbs.current} 
            goal={carbs.goal}
            color="amber"
          />
          <MacroCard 
            title="Fett" 
            current={fat.current} 
            goal={fat.goal}
            color="rose"
          />
        </div>

        {/* Weight Card */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gewicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums">
                  {weight.current}
                </span>
                <span className="text-muted-foreground">kg</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ziel</p>
                <p className="text-lg font-medium">{weight.goal} kg</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Noch {weight.current - weight.goal} kg bis zum Ziel
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mahlzeiten heute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50">
              {meals.map((meal, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground tabular-nums w-12">
                      {meal.time}
                    </span>
                    <span className="font-medium">{meal.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium tabular-nums">{meal.kcal}</span>
                    <span className="text-muted-foreground text-sm ml-1">kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground">
          Health Dashboard • dangerPete
        </footer>
      </div>
    </div>
  )
}
