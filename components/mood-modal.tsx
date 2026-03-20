'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Smile, Meh, Frown, Zap, Heart, Cloud, Sun, Moon } from 'lucide-react'

interface MoodModalProps {
  open: boolean
  onClose: () => void
  onMoodSelect: (mood: string) => void
}

const moods = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
  { value: 'excited', label: 'Excited', icon: Zap, color: 'text-orange-500' },
  { value: 'calm', label: 'Calm', icon: Cloud, color: 'text-blue-400' },
  { value: 'romantic', label: 'Romantic', icon: Heart, color: 'text-pink-500' },
  { value: 'energetic', label: 'Energetic', icon: Sun, color: 'text-amber-500' },
  { value: 'relaxed', label: 'Relaxed', icon: Moon, color: 'text-indigo-400' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-600' },
]

export function MoodModal({ open, onClose, onMoodSelect }: MoodModalProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) return

    setSubmitting(true)
    try {
      await onMoodSelect(selectedMood)
      onClose()
    } catch (error) {
      console.error('Failed to submit mood:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-background/95">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How are you feeling?</DialogTitle>
          <DialogDescription>
            Select your current mood to get personalized product recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-6">
          {moods.map((mood) => {
            const Icon = mood.icon
            const isSelected = selectedMood === mood.value

            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-4 rounded-lg
                  border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-md scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                  }
                `}
              >
                <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : mood.color}`} />
                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {mood.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || submitting}
          >
            {submitting ? 'Submitting...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
