'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/lib/protected-route'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Package, ArrowRight, ChevronDown, ChevronUp,
  Clock, CheckCircle, Truck, PartyPopper, XCircle, ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProductImageById } from '@/lib/product-images'

interface OrderItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  mood_tag: string
  image_url?: string
}

interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  items: OrderItem[]
  created_at: string
  updated_at: string
}

const STATUS_CONFIG: Record<
  Order['status'],
  { label: string; icon: React.ElementType; className: string }
> = {
  pending:   { label: 'Pending',   icon: Clock,         className: 'bg-amber-100  text-amber-700  border-amber-200'  },
  confirmed: { label: 'Confirmed', icon: CheckCircle,   className: 'bg-blue-100   text-blue-700   border-blue-200'   },
  shipped:   { label: 'Shipped',   icon: Truck,         className: 'bg-violet-100 text-violet-700 border-violet-200' },
  delivered: { label: 'Delivered', icon: PartyPopper,   className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', icon: XCircle,       className: 'bg-red-100    text-red-600    border-red-200'    },
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
  const StatusIcon = cfg.icon

  const date = new Date(order.created_at)
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
  const shortId = order.id.split('-')[0].toUpperCase()

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-neutral-50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200">
          <Package className="h-4.5 w-4.5 text-neutral-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm tracking-tight">#{shortId}</span>
            <span className="text-xs text-muted-foreground">
              {formattedDate} &middot; {formattedTime}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-bold text-base">${order.total_amount.toFixed(2)}</span>
          <Badge
            variant="outline"
            className={cn('gap-1 text-xs font-medium border', cfg.className)}
          >
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </Badge>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-border">
          <ul className="divide-y divide-border">
            {order.items.map(item => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                {/* Product image thumbnail */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                  <Image
                    src={item.image_url || getProductImageById(item.product_id)}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.mood_tag && (
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.mood_tag} mood</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} &times; ${item.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-neutral-50/60">
            <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono text-foreground/70">{order.id}</span></p>
            <div className="text-sm font-bold">
              Total: ${order.total_amount.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersContent() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!token || !API_URL) return

    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/orders?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to load orders')
        const data = await res.json()
        setOrders(data.orders ?? [])
        setTotal(data.total ?? 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    })()
  }, [token, API_URL])

  return (
    <main className="pt-16 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Account</p>
          <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
          {!loading && total > 0 && (
            <p className="text-muted-foreground mt-2 text-sm">
              {total} order{total !== 1 ? 's' : ''} placed
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card h-24 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">No orders yet</p>
              <p className="text-muted-foreground text-sm max-w-sm">
                Once you checkout, your orders will appear here with full status tracking.
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/products">Start Shopping <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Status legend */}
        {orders.length > 0 && (
          <>
            <Separator className="my-10" />
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Order Status Guide</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.entries(STATUS_CONFIG) as [Order['status'], typeof STATUS_CONFIG[Order['status']]][]).map(([key, cfg]) => {
                  const Icon = cfg.icon
                  return (
                    <div key={key} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2', cfg.className)}>
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs font-medium">{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CartSheet />
      <OrdersContent />
      <Footer />
    </ProtectedRoute>
  )
}
