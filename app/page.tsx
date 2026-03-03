'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ProductCard } from '@/components/products/product-card'
import { DUMMY_PRODUCTS, MOOD_CATEGORIES, MOOD_GRADIENTS, MOOD_ICON_COLORS } from '@/lib/dummy-data'
import { getMoodIcon, getCategoryIcon } from '@/lib/icons'
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Sparkles, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURED = DUMMY_PRODUCTS.filter(p => p.featured)
const SHOWCASE = DUMMY_PRODUCTS.slice(0, 5)

const PROMISES = [
  { icon: Truck,       title: 'Free Shipping',   desc: 'On orders over $50' },
  { icon: RefreshCcw,  title: 'Easy Returns',    desc: '30-day returns' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'SSL encrypted' },
  { icon: Sparkles,    title: 'Mood-Curated',    desc: 'Personalised picks' },
]

const CARD_ROTATIONS = [-9, -4, 1, 6, -2]

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch() {
    const q = query.trim()
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <>
      <Navbar />
      <CartSheet />

      <main className="pt-[60px]">

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-5 sm:px-8 pt-20 pb-8">
          <div className="mx-auto max-w-7xl text-center">

            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Mood-Driven Commerce
            </p>

            {/* Headline */}
            <h1 className="text-[clamp(2rem,14vw,5rem)] font-extrabold leading-[1] tracking-tight text-foreground max-w-4xl mx-auto">
              Shop The Way<br />
              <span className="text-primary">You Feel.</span>
            </h1>

            {/* Subtitle + search */}
            <div className="mt-8 flex flex-col  items-center justify-center gap-6 max-w-3xl mx-auto">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
                AURA curates products that match your current mood. Tell us how you feel.
              </p>

              
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-secondary hover:opacity-90 transition-opacity"
              >
                Explore Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#moods"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-3 text-sm font-bold text-foreground hover:border-foreground/30 transition-colors"
              >
                Browse by Mood
              </Link>
            </div>
          </div>

          
        </section>

        {/* ── Mood Selector ──────────────────────────────────────────── */}
        {/* <section id="moods" className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                How are you feeling?
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Shop by Mood.
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all products
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOOD_CATEGORIES.map(mood => {
              const Icon = getMoodIcon(mood.id)
              return (
                <Link
                  key={mood.id}
                  href={`/products?mood=${mood.id}`}
                  className={cn(
                    'group flex flex-col items-center gap-3 rounded-4xl  px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1',
                    mood.cardBg
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{mood.label}</p>
                  </div>
                  
                </Link>
              )
            })}
          </div>
        </section> */}

        {/* ── Featured Products ───────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Editor&apos;s Picks
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Featured This Week.
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              See all
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {FEATURED.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Promise strip ──────────────────────────────────────────── */}


        {/* ── CTA banner ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
          <div
            className="relative overflow-hidden rounded-3xl px-10 py-16 text-center text-background"
            style={{
              backgroundImage: "url('/images/pexels-sheilabox-235376934-12482243.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">
                New Member Offer
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Get 15% off your first order.
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Create a free account and unlock mood-based recommendations, exclusive deals, and early access.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
