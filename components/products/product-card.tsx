'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { type Product } from '@/lib/dummy-data'
import { ShoppingBag, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGE_STYLES: Record<string, string> = {
  'Best Seller': 'bg-amber-100 text-amber-800 border-amber-200',
  'New':         'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Sale':        'bg-red-100 text-red-800 border-red-200',
  'Low Stock':   'bg-orange-100 text-orange-800 border-orange-200',
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    setAdding(true)
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      mood: product.mood,
    })
    await new Promise(r => setTimeout(r, 600))
    setAdding(false)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className={cn(
      'group relative flex flex-col bg-white rounded-4xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-200/70',
      className
    )}>

      {/* Visual area — portrait */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {/* Product image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              BADGE_STYLES[product.badge]
            )}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-red-800">
              -{discount}%
            </span>
          )}
        </div>

        {/* Bottom gradient for readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4">
          <button
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold uppercase tracking-wide transition-opacity',
              product.stock === 0
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-foreground text-background hover:opacity-80'
            )}
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {product.category}
          </p>
          <h3 className="text-sm font-bold leading-tight line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-2.5 w-2.5',
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-neutral-200 text-neutral-200'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 15 && (
            <span className="text-[10px] font-semibold text-orange-600">{product.stock} left</span>
          )}
        </div>
      </div>
    </div>
  )
}
