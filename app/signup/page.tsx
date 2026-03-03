'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { GoogleSignInButton } from '@/components/google-signin-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

const PERKS = [
  'Mood-personalised shopping experience',
  'Early access to new arrivals',
  'Exclusive member-only discounts',
  'Order tracking & history',
]

export default function SignUpPage() {
  const { signup } = useAuth()
  const router = useRouter()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm)  { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      await signup(name, email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background items-center justify-center p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-sm text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-[18px] w-[18px]" />
            </div>
            <span className="text-xl font-bold tracking-tight">AURA</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Join a <span className="text-primary">mood-first</span> shopping community.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Create your free account and let your emotions guide you to the perfect products every time.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-left pt-4">
            {PERKS.map(perk => (
              <li key={perk} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">AURA</span>
        </Link>

        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Already have one?{' '}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Alex Thompson" className="pl-10 h-11" required autoComplete="name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="pl-10 h-11" required autoComplete="email" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className="pl-10 h-11" required autoComplete="new-password" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password" className="pl-10 h-11" required autoComplete="new-password" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 gap-2 font-semibold mt-2" disabled={loading}>
              {loading ? 'Creating account…' : <><span>Create Account</span> <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="px-4 text-xs text-muted-foreground">or sign up with</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <GoogleSignInButton />

          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
