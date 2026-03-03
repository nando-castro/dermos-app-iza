import { useState } from 'react'
import type { CartItem, Procedure } from '../types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (proc: Procedure) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === proc.id)
      if (exists) return prev.map(i => i.id === proc.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...proc, quantity: 1 }]
    })
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const clear = () => setItems([])

  const total = items.reduce((acc, i) => acc + (i.value ?? 0) * i.quantity, 0)

  return { items, add, remove, clear, total }
}
