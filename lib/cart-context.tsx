'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  category: string
  mood: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  itemCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = 'aura_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  function addToCart(product: Omit<CartItem, 'id' | 'quantity'>) {
    if (!isAuthenticated) {
      toast('Sign in to continue shopping', {
        description: 'Create a free account to add items to your cart.',
        action: { label: 'Sign In', onClick: () => (window.location.href = '/signin') },
        duration: 5000,
      })
      return
    }

    setItems(prev => {
      const existing = prev.find(i => i.productId === product.productId)
      if (existing) {
        toast.success('Quantity updated')
        return prev.map(i =>
          i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      toast.success(`${product.name} added to cart`)
      return [...prev, { ...product, id: crypto.randomUUID(), quantity: 1 }]
    })

    setIsCartOpen(true)
  }

  function removeFromCart(productId: string) {
    setItems(prev => prev.filter(i => i.productId !== productId))
    toast.success('Item removed')
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) { removeFromCart(productId); return }
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i))
  }

  function clearCart() { setItems([]) }

  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const itemCount  = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalPrice, itemCount,
      isCartOpen, openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
