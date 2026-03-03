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
          <div className="mx-auto max-w-7xl">

            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Mood-Driven Commerce
            </p>

            {/* Headline */}
            <h1 className="text-[clamp(3.5rem,14vw,8rem)] font-extrabold leading-[0.92] tracking-tight text-foreground max-w-4xl">
              Shop The Way<br />
              <span className="text-primary">You Feel.</span>
            </h1>

            {/* Subtitle + search */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-3xl">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
                AURA curates products that match your current mood. Tell us how you feel.
              </p>

              {/* Search */}
              <div className="w-full sm:w-auto flex items-center rounded-full border border-border bg-white shadow-sm overflow-hidden min-w-[300px] focus-within:border-foreground/30 transition-colors">
                <div className="pl-5 pr-2 flex-shrink-0">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 h-12 bg-transparent px-1 text-sm focus:outline-none placeholder:text-muted-foreground/60"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="m-1 h-10 px-5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-80 transition-opacity flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
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

          {/* ── Showcase cards fan ─────────────────────────────────── */}
          <div className="mx-auto max-w-7xl mt-16 mb-4">
            <div className="flex items-end justify-center gap-3 sm:gap-5 overflow-hidden py-4">
              {SHOWCASE.map((product, i) => {
                const Icon = getCategoryIcon(product.category)
                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-36 sm:w-44 md:w-52 rounded-2xl overflow-hidden shadow-lg shadow-neutral-200/80 hover:shadow-xl hover:shadow-neutral-300/60 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                    style={{ transform: `rotate(${CARD_ROTATIONS[i]}deg) translateY(${i === 2 ? '-12px' : '0'})` }}
                  >
                    <div className={cn(
                      'aspect-[3/4] bg-gradient-to-br flex flex-col items-center justify-center gap-3',
                      MOOD_GRADIENTS[product.mood]
                    )}>
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm">
                        <Icon className={cn('h-7 w-7 sm:h-8 sm:w-8', MOOD_ICON_COLORS[product.mood])} />
                      </div>
                      <p className={cn('text-[10px] font-bold uppercase tracking-widest opacity-60', MOOD_ICON_COLORS[product.mood])}>
                        {product.mood}
                      </p>
                    </div>
                    <div className="bg-white px-3 py-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{product.category}</p>
                      <p className="text-xs font-bold leading-tight line-clamp-1 mt-0.5">{product.name}</p>
                      <p className="text-sm font-extrabold mt-1">${product.price.toFixed(0)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Mood Selector ──────────────────────────────────────────── */}
        <section id="moods" className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
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
                    'group flex flex-col items-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-neutral-200',
                    mood.cardBg
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{mood.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{mood.description}</p>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {mood.productCount} items
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Featured Products ───────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
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
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {PROMISES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24">
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-10 py-16 text-center text-background">
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
