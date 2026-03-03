import type { LucideIcon } from 'lucide-react'
import {
  Sun, Waves, Zap, Target, Paintbrush, Crown,
  Headphones, Leaf, Music, Pen, Coffee, Lightbulb,
  Home, Sparkles, Gem, Tag, Wifi, Camera,
  Award, TreePine, Monitor, Package,
} from 'lucide-react'

export const MOOD_ICON_MAP: Record<string, LucideIcon> = {
  happy:   Sun,
  calm:    Waves,
  excited: Zap,
  focused: Target,
  playful: Paintbrush,
  luxe:    Crown,
}

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  'Electronics':  Monitor,
  'Wellness':     Leaf,
  'Audio':        Headphones,
  'Stationery':   Pen,
  'Beverages':    Coffee,
  'Lighting':     Lightbulb,
  'Home':         Home,
  'Beauty':       Sparkles,
  'Decor':        Gem,
  'Apparel':      Tag,
  'Smart Home':   Wifi,
  'Music':        Music,
  'Photography':  Camera,
  'Jewelry':      Award,
  'Plants':       TreePine,
  'Art':          Paintbrush,
}

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON_MAP[category] ?? Package
}

export function getMoodIcon(mood: string): LucideIcon {
  return MOOD_ICON_MAP[mood] ?? Sparkles
}
