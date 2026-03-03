'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Package } from 'lucide-react'
import { getCategoryIcon } from '@/lib/icons'

export function CartSheet() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={v => !v && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-[420px] gap-0 p-0">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Your Cart
            {itemCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                <Package className="h-7 w-7 text-neutral-400" />
              </div>
              <div>
                <p className="font-semibold">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse our curated collections and find something you love.
                </p>
              </div>
              <Button asChild onClick={closeCart}>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {items.map(item => {
                const ItemIcon = getCategoryIcon(item.category)
                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200">
                      <ItemIcon className="h-6 w-6 text-neutral-500" />
                    </div>

                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.mood}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 rounded-lg border border-border">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-600 text-xs font-medium">Free</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="w-full gap-2" asChild onClick={closeCart}>
                <Link href="/cart">
                  Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={closeCart} asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
