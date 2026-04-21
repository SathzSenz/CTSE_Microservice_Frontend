'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, RefreshCw } from 'lucide-react'

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

type OrderItem = {
  id: string
  product_id: string
  name: string
  quantity: number
}

type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  items: OrderItem[]
  created_at: string
}

type OrdersResponse = {
  orders: Order[]
  total: number
  limit: number
  offset: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const PAGE_SIZE = 20
const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-violet-100 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('authToken') || localStorage.getItem('token') || ''
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (!API_URL) {
      setError('Missing NEXT_PUBLIC_API_URL')
      setLoading(false)
      return
    }

    const token = getToken()
    if (!token) {
      setError('Admin token not found. Please sign in again.')
      setLoading(false)
      return
    }

    setError(null)
    if (isRefresh) setRefreshing(true)

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      })

      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`${API_URL}/api/v1/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to fetch orders')
      }

      const data: OrdersResponse = await res.json()
      setOrders(data.orders ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      console.error('Failed to load admin orders', err)
      setError('Could not load orders. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [offset, statusFilter])

  useEffect(() => {
    fetchOrders(false)
  }, [fetchOrders])

  async function handleUpdateStatus(orderId: string, status: OrderStatus) {
    if (!API_URL) return

    const token = getToken()
    if (!token) {
      setError('Admin token not found. Please sign in again.')
      return
    }

    setUpdatingId(orderId)

    try {
      const res = await fetch(`${API_URL}/api/v1/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update status')
      }

      setOrders(prev => prev.map(order => (
        order.id === orderId ? { ...order, status } : order
      )))
    } catch (err) {
      console.error('Failed to update order status', err)
      setError('Could not update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])
  const currentPage = useMemo(() => Math.floor(offset / PAGE_SIZE) + 1, [offset])

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">Sales</p>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review customer orders and update fulfillment status.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="w-fit"
        >
          <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">All Orders ({total})</h2>

          <div className="flex flex-wrap gap-1.5">
            {(['all', ...STATUSES] as const).map(status => (
              <button
                key={status}
                onClick={() => {
                  setOffset(0)
                  setStatusFilter(status)
                }}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-all border',
                  statusFilter === status
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading orders...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-destructive">{error}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Order</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">User</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Items</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Total</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} className="border-border hover:bg-secondary/40">
                    <TableCell className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell className="text-sm">{order.user_id}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{order.items?.length ?? 0}</TableCell>
                    <TableCell className="font-semibold text-sm">${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize',
                        STATUS_STYLES[order.status]
                      )}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={updatingId === order.id}>
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          {STATUSES.filter(s => s !== order.status).map(status => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleUpdateStatus(order.id, status)}
                              className="capitalize gap-2 text-xs cursor-pointer"
                            >
                              Mark as {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {orders.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No orders found for "{statusFilter}".
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(prev => Math.max(0, prev - PAGE_SIZE))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + PAGE_SIZE >= total}
                  onClick={() => setOffset(prev => prev + PAGE_SIZE)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
