'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingBag, Minus, Plus, Trash2, ArrowRight,
  Package, Lock, ChevronRight
} from 'lucide-react'
import { getCategoryIcon } from '@/lib/icons'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, itemCount, clearCart } = useCart()
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push('/signin')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        clearCart()
        toast.success('Order placed successfully!', {
          description: 'Your items are being processed.',
        })
        router.push('/dashboard')
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Checkout failed. Please try again.')
      }
    } catch {
      toast.error('Could not connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  return (
    <>
      <Navbar />
      <CartSheet />

      <main className="pt-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Your Cart</p>
            <h1 className="text-4xl font-bold tracking-tight">
              {itemCount > 0 ? `${itemCount} Item${itemCount > 1 ? 's' : ''}` : 'Your cart is empty'}
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-2">Nothing here yet</p>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Explore our curated collections and find something that matches your mood.
                </p>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

              {/* Cart items */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Remove all
                  </button>
                </div>

                <ul className="divide-y divide-border">
                  {items.map(item => {
                    const ItemIcon = getCategoryIcon(item.category)
                    return (
                    <li key={item.id} className="flex gap-5 p-6">
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200">
                        <ItemIcon className="h-8 w-8 text-neutral-500" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col gap-3 min-w-0">
                        <div>
                          <p className="font-semibold leading-tight">{item.name}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.mood} mood</p>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                    )
                  })}
                </ul>

                <div className="px-6 py-4 border-t border-border">
                  <Link href="/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl border border-border bg-card overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-semibold text-sm">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {shipping === 0
                        ? <span className="text-emerald-600 font-medium text-xs">Free</span>
                        : <span>${shipping.toFixed(2)}</span>
                      }
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold text-base">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {totalPrice < 50 && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-center text-muted-foreground">
                      Add <span className="text-primary font-semibold">${(50 - totalPrice).toFixed(2)}</span> more for free shipping
                    </div>
                  )}

                  <Button
                    className="w-full h-12 gap-2 text-sm font-semibold"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? (
                      'Processing…'
                    ) : !isAuthenticated ? (
                      <><Lock className="h-4 w-4" /> Sign In to Checkout</>
                    ) : (
                      <>Place Order <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    SSL encrypted & secure checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
