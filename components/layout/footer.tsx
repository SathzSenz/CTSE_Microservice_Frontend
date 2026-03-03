import Link from 'next/link'

const MARQUEE_ITEMS = [
  'Happy Picks', 'Calm Essentials', 'Excited Finds',
  'Focused Zone', 'Playful Vibes', 'Luxe Edit',
]

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products',    href: '/products' },
    { label: 'Happy Picks',     href: '/products?mood=happy' },
    { label: 'Calm Essentials', href: '/products?mood=calm' },
    { label: 'Focus Zone',      href: '/products?mood=focused' },
    { label: 'Luxe Edit',       href: '/products?mood=luxe' },
  ],
  Account: [
    { label: 'Sign In',   href: '/signin' },
    { label: 'Register',  href: '/signup' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Orders', href: '/cart' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use',   href: '#' },
    { label: 'Cookie Policy',  href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white overflow-hidden">

      {/* Big bold statement */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-10 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
              Find Your Feeling
            </p>
            <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.9] tracking-tight text-white">
              SHOP BY YOUR<br />
              <span className="text-primary">MOOD.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:items-end pb-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity self-start lg:self-auto"
            >
              Start Shopping
            </Link>
            <p className="text-sm text-white/40 max-w-xs lg:text-right leading-relaxed">
              AURA curates products that match your current mood.
              Sign up and get 15% off your first order.
            </p>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <p className="text-lg font-extrabold tracking-tight mb-4">
              AURA<span className="text-primary">.</span>
            </p>
            <p className="text-sm text-white/40 leading-relaxed max-w-[180px]">
              A mood-driven shopping experience curated for how you feel.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
                {section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/10 text-xs text-white/30">
          <p>© {new Date().getFullYear()} AURA. All rights reserved.</p>
          <p>SE4010 · SLIIT · Mood-Driven E-Commerce Platform</p>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="border-t border-white/10 overflow-hidden py-4">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {[...Array(2)].map((_, di) => (
            <span key={di} className="flex items-center">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="flex items-center gap-5 pr-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/25">{item}</span>
                  <span className="text-primary text-base font-black">*</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

    </footer>
  )
}
