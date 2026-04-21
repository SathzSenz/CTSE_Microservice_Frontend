const API_URL = process.env.NEXT_PUBLIC_API_URL
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

async function fetchFirstOk(paths: string[]): Promise<Response> {
  const base = PRODUCT_API_URL
  if (!base) {
    throw new Error('Missing NEXT_PUBLIC_PRODUCT_API_URL')
  }

  let lastErrorText = ''

  for (const path of paths) {
    try {
      const res = await fetch(joinUrl(base, path))
      if (res.ok) return res
      lastErrorText = await res.text()
    } catch (err) {
      lastErrorText = err instanceof Error ? err.message : String(err)
    }
  }

  console.error('Backend error:', lastErrorText)
  throw new Error('Failed to fetch products')
}

export async function fetchProducts(): Promise<any[]> {
  const res = await fetchFirstOk(['/api/products', '/products'])
  return res.json()
}

export async function fetchProductById(id: string): Promise<any> {
  const res = await fetchFirstOk([`/api/products/${id}`, `/products/${id}`])
  return res.json()
}
