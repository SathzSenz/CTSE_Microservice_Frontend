'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ProductCard } from '@/components/products/product-card'
import type { Product, Mood } from '@/lib/dummy-data'
import { ArrowRight } from 'lucide-react'
import { fetchProducts as fetchProductsApi } from '@/lib/product-api'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const data = await fetchProductsApi()

        const enriched: Product[] = data.map((p: any) => ({
          ...p,
          mood: p.mood as Mood,
          reviewCount: 0,
        }))

        setFeatured(enriched.filter(p => p.featured))
      } catch (err) {
        console.error('Error fetching featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
      <>
        <Navbar />
        <CartSheet />

        <main className="pt-[60px] min-h-screen">
          {/* ── Hero ───────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden px-5 sm:px-8 pt-24 pb-16"
          style={{
            backgroundImage: "url('/images/4.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto max-w-7xl text-center text-white">

            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
              Mood-Driven Commerce
            </p>

            {/* Headline */}
            <h1 className="text-[clamp(2rem,15vw,5rem)] font-bold leading-[1.1] tracking-tight text-white max-w-4xl mx-auto">
              Shop The Way<br />
              <span className="text-gray-100 font-normal">You Feel.</span>
            </h1>

            {/* Subtitle + search */}
            <div className="mt-8 flex flex-col  items-center justify-center gap-6 max-w-3xl mx-auto">
              <p className="text-base font-medium sm:text-lg text-white/75 leading-relaxed max-w-sm">
                Sazzy Temu curates products that match your current mood. Tell us how you feel.
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
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3 text-sm font-bold text-white hover:bg-white/10 hover:border-white transition-colors"
              >
                Browse by Mood
              </Link>
            </div>
          </div>

          
        </section>

          <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-24">
            <div className="flex justify-between mb-10">
              <div>
                <p className="text-xs uppercase mb-3">
                  Editor&apos;s Picks
                </p>
                <h2 className="text-4xl font-extrabold">
                  Featured This Week
                </h2>
              </div>
              <Link href="/products">
                <ArrowRight />
              </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featured.map(product => (
                      <ProductCard key={product.id} product={product} />
                  ))}
                </div>
            )}
          </section>

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