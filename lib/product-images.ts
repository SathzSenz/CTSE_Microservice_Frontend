import { DUMMY_PRODUCTS } from './dummy-data'

export function getProductImageById(productId: string): string {
  const found = DUMMY_PRODUCTS.find(p => p.id === productId)
  if (found?.image) return found.image

  // Fallback: stable placeholder based on productId
  return `https://picsum.photos/seed/aura-${encodeURIComponent(productId)}/400/500`
}

