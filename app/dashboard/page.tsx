'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { ProtectedRoute } from '@/lib/protected-route'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User, Mail, Shield, ShoppingBag, Package,
  Heart, Settings, LogOut, ArrowRight, Sparkles, Link2, KeyRound
} from 'lucide-react'
import { MOOD_CATEGORIES } from '@/lib/dummy-data'
import { getMoodIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  const mood = MOOD_CATEGORIES.find(m => m.id === 'calm')

  const QUICK_LINKS = [
    { icon: ShoppingBag, label: 'My Cart',   sub: `${itemCount} item${itemCount !== 1 ? 's' : ''}`, href: '/cart',     color: 'bg-amber-100 text-amber-700' },
    { icon: Package,     label: 'My Orders', sub: 'View history',                                    href: '/orders',   color: 'bg-emerald-100 text-emerald-700' },
    { icon: Heart,       label: 'Wishlist',  sub: 'Saved items',                                     href: '/products', color: 'bg-red-100 text-red-600' },
    { icon: Settings,    label: 'Settings',  sub: 'Account prefs',                                   href: '#',         color: 'bg-blue-100 text-blue-700' },
  ]

  return (
    <ProtectedRoute>
      <Navbar />
      <CartSheet />

      <main className="pt-16 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
                {user?.role === 'admin' && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Shield className="h-3 w-3" /> Admin
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize flex items-center gap-1">
                {user?.provider === 'google'
                  ? <><Link2 className="h-3 w-3 inline" /> Google Account</>
                  : <><KeyRound className="h-3 w-3 inline" /> Email Account</>
                }
                {' '}&middot; Member since 2026
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>

          {/* Mood Card */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  Today's Mood
                </p>
                <p className="text-2xl font-bold">How are you feeling?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tell us your mood and we'll find perfect products for you.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {MOOD_CATEGORIES.map(m => {
                const MoodIcon = getMoodIcon(m.id)
                return (
                  <Link
                    key={m.id}
                    href={`/products?mood=${m.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/30 hover:bg-primary/8 hover:text-primary shadow-sm"
                  >
                    <MoodIcon className="h-3 w-3" />
                    {m.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_LINKS.map(({ icon: Icon, label, sub, href, color }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/60"
              >
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Account details */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-sm">Account Details</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { icon: User,   label: 'Full Name',   value: user?.name   ?? '—' },
                { icon: Mail,   label: 'Email',       value: user?.email  ?? '—' },
                { icon: Shield, label: 'Role',        value: user?.role   ?? 'user' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-6 py-4">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium capitalize truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin shortcut */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 group hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Admin Panel</p>
                  <p className="text-xs text-muted-foreground">Manage orders, products, and users</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  )
}
