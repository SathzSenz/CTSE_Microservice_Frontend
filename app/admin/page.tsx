'use client'

import { useState } from 'react'
import {
  DUMMY_ORDERS, DUMMY_PRODUCTS, MONTHLY_REVENUE,
  type Order, MOOD_ICON_COLORS
} from '@/lib/dummy-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import {
  ShoppingBag, DollarSign, Package, TrendingUp,
  MoreHorizontal, ArrowUpRight, Eye
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:   'bg-amber-100  text-amber-800  border-amber-200',
  confirmed: 'bg-blue-100   text-blue-800   border-blue-200',
  shipped:   'bg-violet-100 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100    text-red-800    border-red-200',
}

const STATUSES: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATS = [
  {
    label: 'Total Orders',
    value: DUMMY_ORDERS.length.toString(),
    sub: '+12% this month',
    icon: ShoppingBag,
    trend: 'up',
  },
  {
    label: 'Revenue',
    value: `$${DUMMY_ORDERS.reduce((a, o) => a + o.total, 0).toLocaleString()}`,
    sub: '+8.3% vs last month',
    icon: DollarSign,
    trend: 'up',
  },
  {
    label: 'Products',
    value: DUMMY_PRODUCTS.length.toString(),
    sub: '3 low stock',
    icon: Package,
    trend: 'neutral',
  },
  {
    label: 'Avg. Order',
    value: `$${Math.round(DUMMY_ORDERS.reduce((a, o) => a + o.total, 0) / DUMMY_ORDERS.length)}`,
    sub: '+5.1% vs last month',
    icon: TrendingUp,
    trend: 'up',
  },
]

export default function AdminDashboard() {
  const [orders, setOrders] = useState(DUMMY_ORDERS)
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')

  function updateStatus(id: string, status: Order['status']) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8 space-y-8">

      {/* Page header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, trend }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              </div>
              {trend === 'up' && (
                <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-700">
                  <ArrowUpRight className="h-3 w-3" /> Up
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground mt-1 opacity-70">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-sm">Monthly Revenue</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_REVENUE} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="oklch(0.68 0.15 68)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Recent Orders</h2>

          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', ...STATUSES] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-all border',
                  filter === s
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Order</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Customer</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Mood</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Items</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Total</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Date</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map(order => (
              <TableRow key={order.id} className="border-border hover:bg-secondary/40">
                <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-[11px] text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={cn('text-xs font-medium capitalize', MOOD_ICON_COLORS[order.mood])}>
                    {order.mood}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{order.items}</TableCell>
                <TableCell className="font-semibold text-sm">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={cn(
                    'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize',
                    STATUS_STYLES[order.status]
                  )}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{order.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      {STATUSES.filter(s => s !== order.status).map(s => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className="capitalize gap-2 text-xs cursor-pointer"
                        >
                          Mark as {s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {displayed.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No orders with status "{filter}"
          </div>
        )}
      </div>
    </div>
  )
}
