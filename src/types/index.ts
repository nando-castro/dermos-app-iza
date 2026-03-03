export interface Procedure {
  id: string
  name: string
  value: number | null
  note?: string
  category: string
  doctor?: string
}

export interface CartItem extends Procedure {
  quantity: number
}
