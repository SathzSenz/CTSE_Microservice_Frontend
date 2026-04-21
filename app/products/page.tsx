'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ProductCard } from '@/components/products/product-card'
import type { Product, Mood } from '@/lib/dummy-data'
import { Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MoodFall } from '@/components/ui/mood-fall'

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
]

function ProductsContent() {
    const searchParams = useSearchParams()
    const initialMood: Mood | null = (searchParams.get('mood') as Mood) ?? null
    const initialSearch: string = searchParams.get('search') ?? ''

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const [activeMood, setActiveMood] = useState<Mood | null>(initialMood)
    const [activeCategory, setActiveCategory] = useState('All')
    const [sortBy, setSortBy] = useState('featured')
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [searchInput, setSearchInput] = useState(initialSearch)
    

    useEffect(() => {
        setActiveMood(initialMood)
    }, [initialMood])

    // Fetch products from backend
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('http://ctse-product-alb-1026051491.eu-north-1.elb.amazonaws.com:8080/api/products')

                if (!res.ok) {
                    const text = await res.text()
                    console.error('Backend error:', text)
                    throw new Error('Failed to fetch products')
                }

                const data = await res.json()

                const enriched: Product[] = data.map((p: any) => ({
                    ...p,
                    mood: p.mood as Mood,
                    reviewCount: 0,
                    stock: typeof p.stock === 'number' ? p.stock : 0,
                }))

                setProducts(enriched)

            } catch (err) {
                console.error('Error fetching products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()

    }, [])

    const categories = useMemo(() => {
        return ['All', ...Array.from(new Set(products.map(p => p.category)))]
    }, [products])

    const filtered = useMemo(() => {
        let list = [...products]

        if (activeMood) list = list.filter(p => p.mood === activeMood)
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
            case 'price-asc':
                return [...list].sort((a, b) => a.price - b.price)
            case 'price-desc':
                return [...list].sort((a, b) => b.price - a.price)
            case 'rating':
                return [...list].sort((a, b) => b.rating - a.rating)
            default:
                return list
        }
    }, [products, activeMood, activeCategory, sortBy, searchQuery])

    if (loading) {
        return <div className="p-20 text-center">Loading products...</div>
    }

    return (
        <>
            <Navbar />
            <CartSheet />
            <MoodFall mood={activeMood} />

            <main className="pt-[60px] min-h-screen">
                <div className="mx-auto px-5 sm:px-8 py-14">

                    <h1 className="text-4xl font-extrabold mb-6">All Products</h1>

                    {/* Search */}
                    <div className="mb-8 max-w-md">
                        <div className="flex items-center rounded-full bg-white overflow-hidden">
                            <div className="pl-4 pr-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 h-10 bg-transparent px-2 text-sm focus:outline-none"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') setSearchQuery(searchInput) }}
                            />
                            <button
                                onClick={() => setSearchQuery(searchInput)}
                                className="m-1 h-8 px-4 rounded-full bg-foreground text-background text-xs"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    'rounded-full border px-4 py-1.5 text-xs',
                                    activeCategory === cat
                                        ? 'bg-foreground text-background'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="mb-6 flex items-center gap-3">
                        <SlidersHorizontal className="h-4 w-4" />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <SearchX className="h-8 w-8 mx-auto mb-3 text-neutral-400" />
                            <p>No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    )
}