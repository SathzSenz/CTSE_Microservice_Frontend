'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ProductCard } from '@/components/products/product-card'
import type { Product, Mood } from '@/lib/dummy-data'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:8080/products')
        const data = await res.json()

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

    fetchProducts()
  }, [])

  return (
      <>
        <Navbar />
        <CartSheet />

        <main className="pt-[60px] min-h-screen">

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

        </main>

        <Footer />
      </>
  )
}