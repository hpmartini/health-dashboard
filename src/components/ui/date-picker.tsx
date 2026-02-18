"use client"

import * as React from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setOpen(false)
  }

  const formatDate = (date: Date) => {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 h-auto rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-medium text-xs",
            className
          )}
        >
          <CalendarDays size={16} className="text-indigo-400" />
          <span>{date ? formatDate(date) : "Datum wählen"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-zinc-900 border-white/10" 
        align="end"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={de}
          className="bg-zinc-900 text-zinc-100"
          classNames={{
            day: "text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800",
            day_selected: "bg-indigo-600 text-white hover:bg-indigo-500",
            day_today: "bg-zinc-800 text-white",
            day_outside: "text-zinc-600",
            caption: "text-zinc-100",
            nav_button: "text-zinc-400 hover:text-white hover:bg-zinc-800",
            head_cell: "text-zinc-500",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
