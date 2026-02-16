'use client'

interface Props {
  data: {
    protein: number
    carbs: number
    fat: number
  }
  goals: {
    protein: number
    carbs: number
    fat: number
  }
}

export function MacroChart({ data, goals }: Props) {
  const macros = [
    { name: 'Protein', current: data.protein, goal: goals.protein, color: 'bg-blue-500', textColor: 'text-blue-400' },
    { name: 'Carbs', current: data.carbs, goal: goals.carbs, color: 'bg-orange-500', textColor: 'text-orange-400' },
    { name: 'Fett', current: data.fat, goal: goals.fat, color: 'bg-pink-500', textColor: 'text-pink-400' },
  ]

  return (
    <div className="space-y-6">
      {macros.map((macro) => {
        const percentage = Math.min((macro.current / macro.goal) * 100, 100)
        const remaining = macro.goal - macro.current
        const isOver = remaining < 0
        
        return (
          <div key={macro.name}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">{macro.name}</span>
              <span className={macro.textColor}>
                {macro.current.toFixed(0)}g / {macro.goal}g
              </span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${macro.color} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
              <span className={`text-xs ${isOver ? 'text-red-400' : 'text-gray-500'}`}>
                {isOver ? `${Math.abs(remaining).toFixed(0)}g über` : `${remaining.toFixed(0)}g übrig`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
