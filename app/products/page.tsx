'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ProductCard } from '@/components/products/product-card'
import { DUMMY_PRODUCTS, MOOD_CATEGORIES, type Mood, type Product } from '@/lib/dummy-data'
import { getMoodIcon } from '@/lib/icons'
import { X, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
]

type ApiProduct = {
  id: string
  name: string
  price: number
  mood: Mood
  stock: number
}

function ProductsContent() {
  const searchParams    = useSearchParams()
  const initialMood     = (searchParams.get('mood') as Mood) ?? null
  const initialSearch   = searchParams.get('search') ?? ''

  const [activeMood,     setActiveMood]     = useState<Mood | null>(initialMood)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy,         setSortBy]         = useState('featured')
  const [searchQuery,    setSearchQuery]    = useState(initialSearch)
  const [searchInput,    setSearchInput]    = useState(initialSearch)
  const [products,       setProducts]       = useState<Product[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`)
        if (!res.ok) {
          throw new Error('Failed to load products')
        }
        const data: ApiProduct[] = await res.json()

        if (cancelled) return

        const mapped: Product[] = data.map(p => ({
          id: p.id,
          name: p.name,
          description: `${p.name} to match your ${p.mood} mood.`,
          price: p.price,
          mood: p.mood,
          category: 'Mood Products',
          stock: p.stock,
          rating: 4.7,
          reviewCount: 128,
          image: `https://picsum.photos/seed/aura-${p.id}/400/500`,
        }))

        setProducts(mapped)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Could not load products. Please try again later.')
        setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (API_URL) {
      loadProducts()
    } else {
      // Fallback to dummy products if API URL is not configured
      setProducts(DUMMY_PRODUCTS)
      setLoading(false)
    }

    return () => { cancelled = true }
  }, [API_URL])

  const CATEGORIES = useMemo(
    () => ['All', ...Array.from(new Set(products.map(p => p.category)))],
    [products],
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeMood)               list = list.filter(p => p.mood === activeMood)
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.mood.toLowerCase().includes(q)
      )
    }
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'rating':     return [...list].sort((a, b) => b.rating - a.rating)
      default:           return list
    }
  }, [products, activeMood, activeCategory, sortBy, searchQuery])

  function clearFilters() {
    setActiveMood(null)
    setActiveCategory('All')
    setSortBy('featured')
    setSearchQuery('')
    setSearchInput('')
  }

  const hasFilters = activeMood !== null || activeCategory !== 'All' || searchQuery !== ''

  const pageTitle = activeMood
    ? `${MOOD_CATEGORIES.find(m => m.id === activeMood)?.label} Picks`
    : searchQuery
      ? `"${searchQuery}"`
      : 'All Products'

  return (
    <>
      <Navbar />
      <CartSheet />

      <main className="pt-[60px] min-h-screen">
        <div className="mx-auto  px-5 sm:px-8 py-14">

          {/* Page header */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Discover</p>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">{pageTitle}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              {activeMood ? ` matched to your ${activeMood} mood` : ''}
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-8 max-w-md">
            <div className="flex items-center rounded-full  bg-white overflow-hidden focus-within:border-foreground/30 transition-colors">
              <div className="pl-4 pr-2 flex-shrink-0">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 h-10 bg-transparent px-1 text-sm focus:outline-none placeholder:text-muted-foreground/60"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') setSearchQuery(searchInput) }}
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setSearchQuery('') }}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => setSearchQuery(searchInput)}
                className="m-1 h-8 px-4 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-80 transition-opacity flex-shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* Mood filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setActiveMood(null)}
              className={cn(
                'rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all',
                !activeMood
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              )}
            >
              All Moods
            </button>
            {MOOD_CATEGORIES.map(mood => {
              const MoodIcon = getMoodIcon(mood.id)
              const active = activeMood === mood.id
              return (
                <button
                  key={mood.id}
                  onClick={() => setActiveMood(active ? null : mood.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all',
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  <MoodIcon className="h-3 w-3" />
                  {mood.label}
                </button>
              )
            })}
          </div>

          {/* Category + sort bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                    activeCategory === cat
                      ? 'border-neutral-300 bg-neutral-100 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
              <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
                <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-medium text-foreground focus:outline-none"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Loading products…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                <SearchX className="h-7 w-7 text-neutral-400" />
              </div>
              <div>
                <p className="font-bold text-lg">
                  {error ? 'Unable to load products' : 'No products found'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error ?? 'Try adjusting your filters or search term.'}
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:border-foreground/30 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
