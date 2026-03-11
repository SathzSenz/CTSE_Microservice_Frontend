'use client'

import { useEffect, useState } from "react"
import { Smile, Frown, Zap, Wind, AlertCircle, Meh, PartyPopper, ScanEye, Balloon, BadgeDollarSign } from "lucide-react"


const MOOD_CONFIG: Record<string, { icon: any; color: string }> = {
  happy: { icon: Smile, color: "text-yellow-400" },
  sad: { icon: Frown, color: "text-blue-400" },
  excited: { icon: Balloon, color: "text-orange-400" },
  calm: { icon: Wind, color: "text-cyan-400" },
  anxious: { icon: AlertCircle, color: "text-red-400" },
  neutral: { icon: Meh, color: "text-gray-400" },
  playful: { icon: PartyPopper, color: "text-pink-400" },
  focused: { icon: ScanEye, color: "text-red-400" },
  luxe: { icon: BadgeDollarSign, color: "text-green-400" },
}

interface Emoji {
  id: number
  left: number
  duration: number
}

export function MoodFall({ mood }: { mood: string | null }) {

  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [spawning, setSpawning] = useState(true)

  useEffect(() => {

    let id = 0

    const spawnInterval = setInterval(() => {

      if (!spawning) return

      setEmojis(prev => [
        ...prev,
        {
          id: id++,
          left: Math.random() * 100,
          duration: 3 + Math.random() * 3
        }
      ])

    }, 200)

    const stopTimer = setTimeout(() => {
      setSpawning(false)
      clearInterval(spawnInterval)
    }, 5000)

    return () => {
      clearInterval(spawnInterval)
      clearTimeout(stopTimer)
    }

  }, [spawning])

  const config = MOOD_CONFIG[mood ?? "neutral"] || MOOD_CONFIG["neutral"]
  const Icon = config.icon
  const colorClass = config.color

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">

      {emojis.map(e => (

        <span
          key={e.id}
          className="absolute animate-fall"
          style={{
            left: `${e.left}%`,
            animationDuration: `${e.duration}s`
          }}
        >
          <Icon size={28} className={colorClass} />
        </span>

      ))}

    </div>
  )
}