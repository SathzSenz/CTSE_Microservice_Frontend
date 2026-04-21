'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/dummy-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

type StockProduct = {
  id: string
  name: string
  category: string
  stock: number
}

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of stock', variant: 'destructive' as const }
  if (stock <= 10) return { label: 'Low stock', variant: 'secondary' as const }
  return { label: 'In stock', variant: 'outline' as const }
}

export default function AdminStocksPage() {
  const [products, setProducts] = useState<StockProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://ctse-product-alb-1026051491.eu-north-1.elb.amazonaws.com:8080/api/api/products')

        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()

        setProducts(data)

      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleChangeStock(id: string, value: string) {
    const parsed = parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 0) return

    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: parsed } : p))
  }

  async function handleSave(id: string) {
    const current = products.find(p => p.id === id)
    if (!current) return

    const previousStock = current.stock
    setUpdatingId(id)

    try {
      // 🔥 CALL YOUR BACKEND HERE
      await fetch('http://ctse-product-alb-1026051491.eu-north-1.elb.amazonaws.com:8080/api/admin/stock/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Role: localStorage.getItem('role') || '',
        },
        body: JSON.stringify({
          product_id: id,
          stock: current.stock,
        }),
      })

      // ✅ update UI
      setProducts(prev =>
          prev.map(p =>
              p.id === id ? { ...p, stock: current.stock } : p
          )
      )

      toast({
        title: 'Stock updated',
        description: `New stock: ${current.stock}`,
      })

    } catch (err) {
      console.error('Failed to update stock', err)

      // 🔁 rollback UI
      setProducts(prev =>
          prev.map(p =>
              p.id === id ? { ...p, stock: previousStock } : p
          )
      )

      toast({
        title: 'Update failed',
        description: 'Could not update stock',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <div className="p-8">Loading stock...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">Inventory</p>
        <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust available quantities for your products.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => {
              const status = getStockStatus(product.stock)
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{product.name}</span>
                      <span className="text-xs text-muted-foreground">ID: {product.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{product.category}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={product.stock}
                      onChange={e => handleChangeStock(product.id, e.target.value)}
                      className="w-24 h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleSave(product.id)}
                      disabled={updatingId === product.id}
                    >
                      {updatingId === product.id ? 'Saving...' : 'Save'}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No products to manage.
          </div>
        )}
      </div>
    </div>
  )
}

