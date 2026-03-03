export type Mood = 'happy' | 'calm' | 'excited' | 'focused' | 'playful' | 'luxe'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  mood: Mood
  category: string
  stock: number
  rating: number
  reviewCount: number
  badge?: 'Best Seller' | 'New' | 'Sale' | 'Low Stock'
  featured?: boolean
  image: string
}

export interface MoodCategory {
  id: Mood
  label: string
  description: string
  cardBg: string
  productCount: number
}

export interface Order {
  id: string
  customer: string
  email: string
  items: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  mood: Mood
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  { id: 'happy',   label: 'Happy',   description: 'Brighten your day',      cardBg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',   productCount: 4 },
  { id: 'calm',    label: 'Calm',    description: 'Find your peace',         cardBg: 'bg-sky-50 border-sky-200 hover:bg-sky-100',         productCount: 4 },
  { id: 'excited', label: 'Excited', description: 'Feel the energy',         cardBg: 'bg-orange-50 border-orange-200 hover:bg-orange-100', productCount: 3 },
  { id: 'focused', label: 'Focused', description: 'Stay in the zone',        cardBg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100', productCount: 4 },
  { id: 'playful', label: 'Playful', description: 'Unleash your creativity', cardBg: 'bg-violet-50 border-violet-200 hover:bg-violet-100', productCount: 3 },
  { id: 'luxe',    label: 'Luxe',    description: 'Indulge yourself',        cardBg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100', productCount: 3 },
]

export const MOOD_GRADIENTS: Record<Mood, string> = {
  happy:   'from-amber-100 to-yellow-50',
  calm:    'from-sky-100 to-blue-50',
  excited: 'from-orange-100 to-red-50',
  focused: 'from-emerald-100 to-teal-50',
  playful: 'from-violet-100 to-purple-50',
  luxe:    'from-yellow-100 to-amber-50',
}

export const MOOD_ICON_COLORS: Record<Mood, string> = {
  happy:   'text-amber-600',
  calm:    'text-sky-600',
  excited: 'text-orange-600',
  focused: 'text-emerald-700',
  playful: 'text-violet-600',
  luxe:    'text-yellow-700',
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Noise-Cancelling Headphones',
    description: 'Over-ear wireless headphones with 30h battery, Hi-Res audio, and adaptive ANC technology.',
    price: 299.00,
    originalPrice: 399.00,
    mood: 'focused',
    category: 'Electronics',
    stock: 45,
    rating: 4.8,
    reviewCount: 312,
    badge: 'Best Seller',
    featured: true,
    image: '/placeholder.jpg',
  },
  {
    id: 'p2',
    name: 'Aromatherapy Diffuser Set',
    description: 'Ultrasonic essential oil diffuser with 12 premium oils, 7-colour ambient light, and 6h timer.',
    price: 85.00,
    mood: 'calm',
    category: 'Wellness',
    stock: 78,
    rating: 4.6,
    reviewCount: 189,
    featured: true,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p3',
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound, IP67 waterproof, 24h playback. Your perfect companion anywhere.',
    price: 149.00,
    mood: 'happy',
    category: 'Audio',
    stock: 32,
    rating: 4.7,
    reviewCount: 256,
    badge: 'Best Seller',
    featured: true,
    image: '/placeholder.jpg',
  },
  {
    id: 'p4',
    name: 'Leather Journal & Pen Set',
    description: 'Handcrafted Italian leather journal with fountain pen and premium ink cartridges.',
    price: 65.00,
    mood: 'focused',
    category: 'Stationery',
    stock: 60,
    rating: 4.9,
    reviewCount: 143,
    featured: true,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p5',
    name: 'Gourmet Tea Collection',
    description: '24-variety curated tea chest with rare single-estate teas from across the world.',
    price: 45.00,
    mood: 'calm',
    category: 'Beverages',
    stock: 120,
    rating: 4.7,
    reviewCount: 98,
    badge: 'New',
    image: '/placeholder.jpg',
  },
  {
    id: 'p6',
    name: 'LED Mood Light Lamp',
    description: 'Touch-sensitive gradient lamp with 16M colours, music sync, and app control.',
    price: 89.00,
    mood: 'playful',
    category: 'Lighting',
    stock: 54,
    rating: 4.5,
    reviewCount: 201,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p7',
    name: 'Artisan Coffee Kit',
    description: 'Complete pour-over set with gooseneck kettle, scale, grinder, and specialty beans.',
    price: 95.00,
    mood: 'focused',
    category: 'Beverages',
    stock: 29,
    rating: 4.8,
    reviewCount: 167,
    badge: 'Low Stock',
    image: '/placeholder.jpg',
  },
  {
    id: 'p8',
    name: 'Rose Quartz Facial Set',
    description: 'Gua sha board, facial roller, and jade eye massager for a complete ritual.',
    price: 55.00,
    mood: 'calm',
    category: 'Beauty',
    stock: 90,
    rating: 4.6,
    reviewCount: 214,
    reviewCount: 214,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p9',
    name: 'Levitating Globe Lamp',
    description: 'Magnetically levitating illuminated globe — conversation piece and night light.',
    price: 189.00,
    mood: 'excited',
    category: 'Decor',
    stock: 15,
    rating: 4.4,
    reviewCount: 89,
    badge: 'Low Stock',
    image: '/placeholder.jpg',
  },
  {
    id: 'p10',
    name: 'Premium Silk Robe',
    description: '100% mulberry silk, hand-stitched seams, available in 8 natural dye colourways.',
    price: 165.00,
    originalPrice: 210.00,
    mood: 'luxe',
    category: 'Apparel',
    stock: 22,
    rating: 4.9,
    reviewCount: 77,
    badge: 'Sale',
    featured: true,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p11',
    name: 'Pocket Projector Mini',
    description: '1080p native resolution, 4h battery, auto-keystone. Cinema anywhere, anytime.',
    price: 299.00,
    mood: 'excited',
    category: 'Electronics',
    stock: 18,
    rating: 4.5,
    reviewCount: 132,
    badge: 'New',
    image: '/placeholder.jpg',
  },
  {
    id: 'p12',
    name: 'Handcrafted Ceramic Vase',
    description: 'Wheel-thrown stoneware with matte glaze, each piece unique. Signed by the artist.',
    price: 75.00,
    mood: 'calm',
    category: 'Decor',
    stock: 11,
    rating: 4.8,
    reviewCount: 56,
  },
  {
    id: 'p13',
    name: 'Smart Home Starter Kit',
    description: 'Hub, 4 smart bulbs, 2 plugs, 1 sensor — all voice-assistant compatible.',
    price: 199.00,
    mood: 'focused',
    category: 'Smart Home',
    stock: 40,
    rating: 4.4,
    reviewCount: 298,
  },
  {
    id: 'p14',
    name: 'Vinyl Record Bundle',
    description: '5 handpicked classic albums across jazz, soul, and funk. Curated by our music editors.',
    price: 89.00,
    mood: 'happy',
    category: 'Music',
    stock: 35,
    rating: 4.7,
    reviewCount: 112,
  },
  {
    id: 'p15',
    name: 'Diamond-Cut Bracelet',
    description: '925 sterling silver with pavé-set cubic zirconia. Comes in a luxury gift box.',
    price: 125.00,
    mood: 'luxe',
    category: 'Jewelry',
    stock: 60,
    rating: 4.8,
    reviewCount: 88,
    badge: 'Best Seller',
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p16',
    name: 'DIY Terrarium Kit',
    description: 'Glass dome, miniature plants, substrate, and accessories. Zero-maintenance ecosystem.',
    price: 68.00,
    mood: 'playful',
    category: 'Plants',
    stock: 47,
    rating: 4.6,
    reviewCount: 173,
    badge: 'New',
    image: '/placeholder.jpg',
  },
  {
    id: 'p17',
    name: 'Polaroid Instant Camera',
    description: 'Modern design, dual lens system, self-timer. Includes 20-shot film pack.',
    price: 119.00,
    mood: 'happy',
    category: 'Photography',
    stock: 33,
    rating: 4.5,
    reviewCount: 341,
    featured: true,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p18',
    name: 'Cashmere Throw Blanket',
    description: 'Grade-A Mongolian cashmere, herringbone weave, oversized at 180×135cm.',
    price: 145.00,
    mood: 'luxe',
    category: 'Home',
    stock: 25,
    rating: 4.9,
    reviewCount: 64,
    image: '/placeholder.jpg',
  },
  {
    id: 'p19',
    name: 'Acrylic Paint Pour Kit',
    description: 'Pre-mixed flow paints, canvases, pouring medium, and a step-by-step guide.',
    price: 49.00,
    mood: 'playful',
    category: 'Art',
    stock: 88,
    rating: 4.6,
    reviewCount: 229,
    image: '/placeholder-user.jpg',
  },
  {
    id: 'p20',
    name: 'Sunrise Alarm Clock',
    description: 'Simulates natural sunrise, FM radio, sleep sounds, and USB charging pad built in.',
    price: 79.00,
    mood: 'happy',
    category: 'Wellness',
    stock: 51,
    rating: 4.7,
    reviewCount: 185,
    image: '/placeholder.jpg',
  },
]

export const DUMMY_ORDERS: Order[] = [
  { id: 'ORD-2491', customer: 'Alex Thompson',  email: 'alex@example.com',   items: 3, total: 549.00, status: 'delivered',  date: '2026-02-28', mood: 'focused' },
  { id: 'ORD-2490', customer: 'Priya Sharma',   email: 'priya@example.com',  items: 1, total: 165.00, status: 'shipped',    date: '2026-02-27', mood: 'luxe' },
  { id: 'ORD-2489', customer: 'James Nguyen',   email: 'james@example.com',  items: 5, total: 403.00, status: 'confirmed',  date: '2026-02-27', mood: 'happy' },
  { id: 'ORD-2488', customer: 'Mia Kowalski',   email: 'mia@example.com',    items: 2, total: 234.00, status: 'pending',    date: '2026-02-26', mood: 'calm' },
  { id: 'ORD-2487', customer: 'Carlos Rivera',  email: 'carlos@example.com', items: 1, total: 299.00, status: 'shipped',    date: '2026-02-25', mood: 'excited' },
  { id: 'ORD-2486', customer: 'Sophie Laurent', email: 'sophie@example.com', items: 4, total: 712.00, status: 'delivered',  date: '2026-02-24', mood: 'luxe' },
  { id: 'ORD-2485', customer: 'David Kim',      email: 'david@example.com',  items: 2, total: 184.00, status: 'cancelled',  date: '2026-02-24', mood: 'playful' },
  { id: 'ORD-2484', customer: 'Aisha Patel',    email: 'aisha@example.com',  items: 3, total: 359.00, status: 'delivered',  date: '2026-02-23', mood: 'calm' },
  { id: 'ORD-2483', customer: 'Noah Williams',  email: 'noah@example.com',   items: 1, total: 89.00,  status: 'delivered',  date: '2026-02-22', mood: 'playful' },
  { id: 'ORD-2482', customer: 'Emma Johnson',   email: 'emma@example.com',   items: 6, total: 897.00, status: 'shipped',    date: '2026-02-21', mood: 'happy' },
]

export const MONTHLY_REVENUE = [
  { month: 'Sep', revenue: 18400 },
  { month: 'Oct', revenue: 22100 },
  { month: 'Nov', revenue: 31500 },
  { month: 'Dec', revenue: 45800 },
  { month: 'Jan', revenue: 28900 },
  { month: 'Feb', revenue: 34200 },
]
