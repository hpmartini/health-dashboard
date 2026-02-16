'use client'

import { useState } from 'react'

// Demo data
const data = {
  date: "16. Februar 2026",
  kalorien: { aktuell: 1767, ziel: 2000 },
  protein: { aktuell: 81, ziel: 150 },
  kohlenhydrate: { aktuell: 159, ziel: 180 },
  fett: { aktuell: 72, ziel: 60 },
  gewicht: { aktuell: 78, ziel: 70, start: 78 },
  mahlzeiten: [
    { zeit: "08:35", name: "Rote Wurst", kcal: 84, p: 3.6, kh: 0, f: 7.8 },
    { zeit: "12:23", name: "Joghurt & Müsli", kcal: 398, p: 14, kh: 55, f: 14 },
    { zeit: "15:50", name: "Curry-Eintopf", kcal: 950, p: 27, kh: 95, f: 42 },
    { zeit: "19:22", name: "Protein Shake", kcal: 335, p: 36.5, kh: 8.5, f: 15.6 },
  ]
}

// Circular Progress
function Ring({ 
  wert, 
  max, 
  farbe,
  size = 72
}: { 
  wert: number
  max: number
  farbe: string
  size?: number
}) {
  const prozent = Math.min((wert / max) * 100, 100)
  const radius = (size - 8) / 2
  const umfang = radius * 2 * Math.PI
  const offset = umfang - (prozent / 100) * umfang

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        stroke="#3A3A3C"
        strokeWidth={8}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={farbe}
        strokeWidth={8}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ strokeDasharray: umfang, strokeDashoffset: offset }}
      />
    </svg>
  )
}

// Macro Card
function MakroKarte({ 
  titel, 
  aktuell, 
  ziel, 
  einheit = "g",
  farbe,
  farbeHex,
  cardClass
}: { 
  titel: string
  aktuell: number
  ziel: number
  einheit?: string
  farbe: string
  farbeHex: string
  cardClass: string
}) {
  const rest = ziel - aktuell
  const ueberLimit = rest < 0

  return (
    <div className={`card ${cardClass} p-4`}>
      <p className="text-secondary text-sm mb-3">{titel}</p>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Ring wert={aktuell} max={ziel} farbe={farbeHex} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {Math.round((aktuell / ziel) * 100)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${farbe}`}>
              {aktuell.toFixed(0)}
            </span>
            <span className="text-secondary text-sm">/ {ziel}{einheit}</span>
          </div>
          <p className={`text-sm mt-1 ${ueberLimit ? 'text-[#FF453A]' : 'text-secondary'}`}>
            {ueberLimit ? `${Math.abs(rest).toFixed(0)}${einheit} über` : `${rest.toFixed(0)}${einheit} übrig`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [zeitraum, setZeitraum] = useState("tag")
  const { kalorien, protein, kohlenhydrate, fett, gewicht, mahlzeiten } = data

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-6 pb-safe">
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
          <p className="text-secondary text-sm">Montag, {data.date}</p>
        </header>

        {/* Zeitraum Auswahl - Dark Mode Style */}
        <div className="segmented-control flex">
          {['tag', 'woche', 'monat', 'jahr'].map((z) => (
            <button
              key={z}
              onClick={() => setZeitraum(z)}
              className={`flex-1 capitalize ${zeitraum === z ? 'active' : ''}`}
            >
              {z.charAt(0).toUpperCase() + z.slice(1)}
            </button>
          ))}
        </div>

        {/* Makro Karten */}
        <div className="grid grid-cols-2 gap-3">
          <MakroKarte 
            titel="Kalorien" 
            aktuell={kalorien.aktuell} 
            ziel={kalorien.ziel}
            einheit=" kcal"
            farbe="accent-green"
            farbeHex="#30D158"
            cardClass="card-calories"
          />
          <MakroKarte 
            titel="Protein" 
            aktuell={protein.aktuell} 
            ziel={protein.ziel}
            farbe="accent-blue"
            farbeHex="#0A84FF"
            cardClass="card-protein"
          />
          <MakroKarte 
            titel="Kohlenhydrate" 
            aktuell={kohlenhydrate.aktuell} 
            ziel={kohlenhydrate.ziel}
            farbe="accent-orange"
            farbeHex="#FF9F0A"
            cardClass="card-carbs"
          />
          <MakroKarte 
            titel="Fett" 
            aktuell={fett.aktuell} 
            ziel={fett.ziel}
            farbe="accent-red"
            farbeHex="#FF453A"
            cardClass="card-fat"
          />
        </div>

        {/* Gewicht */}
        <div className="card card-weight p-4">
          <div className="flex justify-between items-start mb-3">
            <p className="text-secondary text-sm">Gewicht</p>
            <span className="text-xs px-2 py-1 rounded-full bg-[#3A3A3C] text-white">
              noch {gewicht.aktuell - gewicht.ziel} kg
            </span>
          </div>
          
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-4xl font-bold text-white">{gewicht.aktuell}</span>
              <span className="text-secondary ml-1">kg</span>
            </div>
            <div className="text-right">
              <p className="text-secondary text-xs">Ziel</p>
              <p className="text-xl font-semibold accent-purple">{gewicht.ziel} kg</p>
            </div>
          </div>
          
          <div className="progress-track">
            <div 
              className="progress-fill progress-fill-red" 
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Mahlzeiten */}
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-secondary text-sm">Mahlzeiten heute</p>
            <span className="text-secondary text-xs">{mahlzeiten.length} Einträge</span>
          </div>
          
          <div className="space-y-2">
            {mahlzeiten.map((m, i) => (
              <div key={i} className="list-item flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{m.name}</p>
                  <p className="text-secondary text-xs">
                    {m.zeit} · {m.p}g P · {m.kh}g KH · {m.f}g F
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{m.kcal}</p>
                  <p className="text-secondary text-xs">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zusammenfassung */}
        <div className="card p-4">
          <p className="text-secondary text-sm mb-3">Übrig heute</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold accent-green">
                +{kalorien.ziel - kalorien.aktuell}
              </p>
              <p className="text-secondary text-xs">kcal</p>
            </div>
            <div>
              <p className="text-lg font-bold accent-blue">
                +{protein.ziel - protein.aktuell}g
              </p>
              <p className="text-secondary text-xs">Protein</p>
            </div>
            <div>
              <p className="text-lg font-bold accent-orange">
                +{kohlenhydrate.ziel - kohlenhydrate.aktuell}g
              </p>
              <p className="text-secondary text-xs">KH</p>
            </div>
            <div>
              <p className="text-lg font-bold accent-red">
                {fett.ziel - fett.aktuell}g
              </p>
              <p className="text-secondary text-xs">Fett</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-tertiary text-xs py-4">
          Health Dashboard • dangerPete
        </footer>
      </div>
    </div>
  )
}
