'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { getProductImageById } from './product-images'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  category: string
  mood: string
  image: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalPrice: number
  itemCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated, token } = useAuth()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Load cart from Order Service when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token || !API_URL) {
      setItems([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled || !data?.items) return

        const serverItems = (data.items as any[]).map(item => {
          const productId = item.product_id as string
          return {
            id: item.id as string,
            productId,
            name: item.name as string,
            price: item.price as number,
            quantity: item.quantity as number,
            category: 'Mood Products',
            mood: (item.mood_tag as string) || 'mood',
            image: (item.image_url as string) || getProductImageById(productId),
          }
        })
        setItems(serverItems)
      } catch {
        // fail silently; cart UI will just appear empty
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, token, API_URL])

  async function addToCart(product: Omit<CartItem, 'id' | 'quantity'>) {
    if (!isAuthenticated || !token || !API_URL) {
      toast('Sign in to continue shopping', {
        description: 'Create a free account to add items to your cart.',
        action: { label: 'Sign In', onClick: () => (window.location.href = '/signin') },
        duration: 5000,
      })
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          mood_tag: product.mood,
          image_url: product.image,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to add to cart')
      }

      const serverItem = await res.json()

      setItems(prev => {
        const next = [...prev]
        const idx = next.findIndex(i => i.id === serverItem.id)
        const mapped: CartItem = {
          id: serverItem.id,
          productId: serverItem.product_id,
          name: serverItem.name,
          price: serverItem.price,
          quantity: serverItem.quantity,
          category: product.category,
          mood: serverItem.mood_tag ?? product.mood,
          image: serverItem.image_url ?? product.image ?? getProductImageById(serverItem.product_id),
        }
        if (idx >= 0) {
          next[idx] = mapped
          return next
        }
        return [...next, mapped]
      })

      toast.success(`${product.name} added to cart`)
      setIsCartOpen(true)
    } catch (err) {
      console.error(err)
      toast.error('Could not add to cart. Please try again.')
    }
  }

  async function removeFromCart(productId: string) {
    const item = items.find(i => i.productId === productId)
    if (!item) return

    try {
      if (isAuthenticated && token && API_URL) {
        await fetch(`${API_URL}/api/v1/cart/items/${item.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setItems(prev => prev.filter(i => i.productId !== productId))
      toast.success('Item removed')
    } catch (err) {
      console.error(err)
      toast.error('Could not remove item. Please try again.')
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    const item = items.find(i => i.productId === productId)
    if (!item) return

    try {
      if (isAuthenticated && token && API_URL) {
        const res = await fetch(`${API_URL}/api/v1/cart/items/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? 'Failed to update cart')
        }
      }

      setItems(prev =>
        prev.map(i => (i.productId === productId ? { ...i, quantity } : i)),
      )
    } catch (err) {
      console.error(err)
      toast.error('Could not update cart item. Please try again.')
    }
  }

  async function clearCart() {
    try {
      if (isAuthenticated && token && API_URL) {
        await fetch(`${API_URL}/api/v1/cart`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setItems([])
    } catch (err) {
      console.error(err)
      toast.error('Could not clear cart. Please try again.')
    }
  }

  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        itemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
