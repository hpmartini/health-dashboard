'use client'

interface Props {
  calories: number
  protein: number
  carbs: number
  fat: number
  goals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export function DailyOverview({ calories, protein, carbs, fat, goals }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        label="Kalorien" 
        value={calories} 
        goal={goals.calories} 
        unit="kcal" 
        color="green"
      />
      <StatCard 
        label="Protein" 
        value={protein} 
        goal={goals.protein} 
        unit="g" 
        color="blue"
      />
      <StatCard 
        label="Carbs" 
        value={carbs} 
        goal={goals.carbs} 
        unit="g" 
        color="orange"
      />
      <StatCard 
        label="Fett" 
        value={fat} 
        goal={goals.fat} 
        unit="g" 
        color="pink"
      />
    </div>
  )
}

function StatCard({ label, value, goal, unit, color }: { 
  label: string
  value: number
  goal: number
  unit: string
  color: string
}) {
  const percentage = Math.min((value / goal) * 100, 100)
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}{unit}</p>
      <p className="text-gray-500 text-xs">/ {goal}{unit}</p>
      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color]} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
