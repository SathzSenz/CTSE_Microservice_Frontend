'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingBag, User, LogOut, Menu, LayoutDashboard, ShieldCheck, Search, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/products',              label: 'Shop'    },
  { href: '/products?mood=happy',   label: 'Happy'   },
  { href: '/products?mood=calm',    label: 'Calm'    },
  { href: '/products?mood=focused', label: 'Focused' },
  { href: '/products?mood=luxe',    label: 'Luxe'    },
]

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const moodParam = searchParams.get('mood')
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount, openCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg ">
      <div className="mx-auto flex h-[60px]  items-center justify-between px-8 sm:px-24">

        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-foreground shrink-0">
          Sazzy Temu
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-md font-medium transition-colors',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Search (desktop) */}
          <Link
            href="/products"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="size-5" />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-secondary">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Auth — desktop */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold ml-1 hover:opacity-80 transition-opacity">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  {isAdmin && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                      <ShieldCheck className="h-2.5 w-2.5" /> Admin
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <Link
                href="/signin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-1"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-foreground text-background rounded-full px-4 py-1.5 hover:opacity-80 transition-opacity"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
                {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12 bg-background">
              <nav className="flex flex-col gap-0.5">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 border-t border-border" />
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false) }}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-secondary rounded-lg">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2 px-1">
                    <Link href="/signin" onClick={() => setMobileOpen(false)}
                      className="text-center py-2.5 text-sm font-medium border border-border rounded-full hover:bg-secondary transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}
                      className="text-center py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-80 transition-opacity">
                      Join
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
