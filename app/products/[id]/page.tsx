'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/dummy-data'
import { Star, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) fetchProduct()
  }, [params?.id])

  if (loading) return <div className="p-20 text-center">Loading product...</div>
  if (!product) return <div className="p-20 text-center">Product not found</div>

  return (
    <>
      <Navbar />
      <CartSheet />

      <main className="pt-[60px] min-h-screen">
        <div className="mx-auto px-5 sm:px-8 py-14 max-w-6xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>

              <p className="text-2xl font-bold mb-2">${product.price.toFixed(2)}</p>

              <p className="text-sm mb-4">
                {product.stock === 0 && <span className="text-red-600 font-medium">Out of stock</span>}
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-orange-600 font-medium">Only {product.stock} left</span>
                )}
                {product.stock > 10 && (
                  <span className="text-emerald-600 font-medium">In stock</span>
                )}
              </p>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-neutral-100">
                  {product.category}
                </span>
                <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs bg-neutral-100">
                  {product.mood}
                </span>
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              <button
                onClick={() => addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  mood: product.mood,
                  image: product.image,
                })}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-full font-medium hover:opacity-90 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
