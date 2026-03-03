import { Search, ShoppingCart, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useCart } from './hooks/useCart'
import { parseProcedures } from './lib/parseProcedures'
import type { CartItem, Procedure } from './types'

const ALL_PROCEDURES = parseProcedures()
const CATEGORIES = ['Todos', ...Array.from(new Set(ALL_PROCEDURES.map(p => p.category)))]
const DOCTORS = Array.from(new Set(ALL_PROCEDURES.filter(p => p.doctor).map(p => p.doctor!)))

function fmt(value: number | null) {
  if (value == null) return 'A consultar'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [activeDoctor, setActiveDoctor] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const { items, add, remove, clear, total } = useCart()
  const categoryScrollRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    return ALL_PROCEDURES.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'Todos' || p.category === activeCategory
      const matchDoctor = !activeDoctor || p.doctor === activeDoctor
      return matchSearch && matchCategory && matchDoctor
    })
  }, [search, activeCategory, activeDoctor])

  const inCart = (id: string) => items.some(i => i.id === id)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setActiveDoctor(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-24">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-3 pb-2">

          {/* Row 1: Logo + Cart (desktop) */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1">
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent leading-tight">
                Clínica Dermos
              </h1>
              <p className="text-[11px] text-gray-400 leading-none">Tabela de Procedimentos</p>
            </div>

            {/* Cart — desktop */}
            <button
              onClick={() => setCartOpen(true)}
              className="hidden md:flex relative items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm font-semibold shadow hover:opacity-90 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              {items.length > 0 ? (
                <span>{items.length} item(s) · {fmt(total)}</span>
              ) : (
                <span>Orçamento</span>
              )}
            </button>
          </div>

          {/* Row 2: Search + Filter button (mobile) */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar procedimento..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter toggle — mobile only */}
            <button
              onClick={() => setFilterOpen(v => !v)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full border transition ${
                filterOpen || activeCategory !== 'Todos' || activeDoctor
                  ? 'bg-pink-500 border-pink-500 text-white'
                  : 'bg-white border-pink-200 text-gray-500'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {(activeCategory !== 'Todos' || activeDoctor) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-pink-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Row 3: Category chips — always visible, horizontal scroll */}
          <div
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto mt-2 pb-1 scrollbar-hide -mx-1 px-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 4: Doctor chips — only when Médicos is active */}
          {activeCategory === 'Médicos' && (
            <div
              className="flex gap-2 overflow-x-auto mt-1.5 pb-1 scrollbar-hide -mx-1 px-1"
              style={{ scrollbarWidth: 'none' }}
            >
              <button
                onClick={() => setActiveDoctor(null)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                  !activeDoctor
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-white border border-blue-200 text-blue-600'
                }`}
              >
                Todos
              </button>
              {DOCTORS.map(doc => (
                <button
                  key={doc}
                  onClick={() => setActiveDoctor(doc === activeDoctor ? null : doc)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                    activeDoctor === doc
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-white border border-blue-200 text-blue-600'
                  }`}
                >
                  {doc.replace('Dr ', 'Dr. ').replace('Dra ', 'Dra. ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-3 py-4 flex gap-6">

        {/* Sidebar — desktop only */}
        <aside className="w-52 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4 sticky top-[152px]">
            <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">Categorias</p>
            <div className="flex flex-col gap-0.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition font-medium ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow'
                      : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeCategory === 'Médicos' && (
              <>
                <p className="text-[11px] font-semibold text-gray-400 uppercase mt-4 mb-2">Médico</p>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => setActiveDoctor(null)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                      !activeDoctor ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    Todos
                  </button>
                  {DOCTORS.map(doc => (
                    <button
                      key={doc}
                      onClick={() => setActiveDoctor(doc)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                        activeDoctor === doc
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      {doc.replace('Dr ', 'Dr. ').replace('Dra ', 'Dra. ')}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-3">
            <span className="font-semibold text-gray-600">{filtered.length}</span> procedimentos
            {search && <> para <strong className="text-pink-500">"{search}"</strong></>}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-300">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-base font-medium">Nenhum resultado encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(proc => (
                <ProcedureCard
                  key={proc.id}
                  proc={proc}
                  inCart={inCart(proc.id)}
                  onAdd={() => add(proc)}
                  onRemove={() => remove(proc.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── FAB Cart — mobile only ── */}
      <button
        onClick={() => setCartOpen(true)}
        className="md:hidden fixed bottom-5 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold shadow-xl hover:opacity-90 transition active:scale-95"
      >
        <ShoppingCart className="w-5 h-5" />
        {items.length > 0 ? (
          <span className="text-sm">{items.length} · {fmt(total)}</span>
        ) : (
          <span className="text-sm">Orçamento</span>
        )}
      </button>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <CartDrawer
          items={items}
          total={total}
          onClose={() => setCartOpen(false)}
          onRemove={remove}
          onClear={clear}
        />
      )}
    </div>
  )
}

/* ─── Procedure Card ─── */
function ProcedureCard({
  proc, inCart, onAdd, onRemove,
}: {
  proc: Procedure
  inCart: boolean
  onAdd: () => void
  onRemove: () => void
}) {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all shadow-sm active:scale-[0.98] p-4 flex flex-col gap-2 ${
        inCart ? 'border-pink-400 ring-2 ring-pink-200' : 'border-gray-100'
      }`}
    >
      <div className="flex flex-wrap gap-1 mb-0.5">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
          {proc.category}
        </span>
        {proc.doctor && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
            {proc.doctor.replace('Dr ', 'Dr. ').replace('Dra ', 'Dra. ')}
          </span>
        )}
        {proc.note && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {proc.note}
          </span>
        )}
      </div>

      <h3 className="text-sm font-bold text-gray-800 leading-snug flex-1">{proc.name}</h3>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
        <span className={`font-extrabold text-base ${proc.value ? 'text-pink-600' : 'text-gray-400'}`}>
          {fmt(proc.value)}
        </span>
        <button
          onClick={inCart ? onRemove : onAdd}
          className={`text-xs px-3 py-1.5 rounded-full font-bold transition active:scale-95 ${
            inCart
              ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow'
          }`}
        >
          {inCart ? '✓ Adicionado' : '+ Adicionar'}
        </button>
      </div>
    </div>
  )
}

/* ─── Cart Drawer ─── */
function CartDrawer({
  items, total, onClose, onRemove, onClear,
}: {
  items: CartItem[]
  total: number
  onClose: () => void
  onRemove: (id: string) => void
  onClear: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer: full screen on mobile, side panel on desktop */}
      <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-[420px] bg-white z-50 shadow-2xl flex flex-col rounded-t-3xl md:rounded-none max-h-[92dvh] md:max-h-full">

        {/* Handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-pink-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Orçamento</h2>
            <p className="text-xs text-gray-400">{items.length} procedimento(s)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3" />
              <p className="text-sm">Nenhum procedimento adicionado</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                      {item.category}
                    </span>
                    {item.doctor && (
                      <span className="text-[11px] px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full font-medium">
                        {item.doctor.replace('Dr ', 'Dr. ').replace('Dra ', 'Dra. ')}
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-gray-400 mt-1">{item.note}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-sm font-bold text-pink-600">{fmt(item.value)}</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-[11px] text-red-400 hover:text-red-600 font-medium transition"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-pink-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">Total estimado</span>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {fmt(total)}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">* Valores sujeitos a confirmação na consulta</p>
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition active:scale-95"
            >
              Limpar orçamento
            </button>
          </div>
        )}
      </div>
    </>
  )
}
