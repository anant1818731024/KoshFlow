import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { brands, categories, conditions } from '@/data/products'
import { useAppStore } from '@/hooks/useAppStore'
import type { NewProductInput } from '@/hooks/useAppStore'
import { useToast } from '@/hooks/useToast'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  editing?: Product | null
}

const empty: NewProductInput = {
  name: '',
  brand: 'Chanel',
  category: 'Handbags',
  condition: 'Excellent',
  color: '',
  purchasePrice: 0,
  sellingPrice: 0,
  stock: 1,
}

export function ProductFormModal({ open, onClose, editing }: ProductFormModalProps) {
  const { addProduct, updateProduct } = useAppStore()
  const { toast } = useToast()
  const [form, setForm] = useState<NewProductInput>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setErrors({})
      if (editing) {
        setForm({
          name: editing.name.replace(`${editing.brand} `, ''),
          brand: editing.brand,
          category: editing.category,
          condition: editing.condition,
          color: editing.color,
          purchasePrice: editing.purchasePrice,
          sellingPrice: editing.sellingPrice,
          stock: editing.stock,
        })
      } else {
        setForm(empty)
      }
    }
  }, [open, editing])

  const set = <K extends keyof NewProductInput>(key: K, value: NewProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const profit = form.sellingPrice - form.purchasePrice
  const margin =
    form.sellingPrice > 0 ? (profit / form.sellingPrice) * 100 : 0

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Product name is required'
    if (!form.color.trim()) next.color = 'Add a colour or material'
    if (form.purchasePrice <= 0) next.purchasePrice = 'Enter a purchase price'
    if (form.sellingPrice <= 0) next.sellingPrice = 'Enter a selling price'
    if (form.sellingPrice < form.purchasePrice)
      next.sellingPrice = 'Selling price is below cost'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = () => {
    if (!validate()) return
    const payload: NewProductInput = {
      ...form,
      name: `${form.brand} ${form.name.trim()}`,
    }
    if (editing) {
      updateProduct(editing.id, payload)
      toast({ title: 'Product updated', description: payload.name, tone: 'success' })
    } else {
      addProduct(payload)
      toast({ title: 'Product added', description: payload.name, tone: 'success' })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit product' : 'Add product'}
      description={
        editing
          ? 'Update the details for this piece.'
          : 'Add a new piece to your inventory.'
      }
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            {editing ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Product name"
            placeholder="Classic Flap Medium"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            invalid={!!errors.name}
            hint={errors.name}
          />
        </div>
        <Select
          label="Brand"
          value={form.brand}
          onChange={(e) => set('brand', e.target.value as NewProductInput['brand'])}
          options={brands.map((b) => ({ value: b, label: b }))}
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) =>
            set('category', e.target.value as NewProductInput['category'])
          }
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <Select
          label="Condition"
          value={form.condition}
          onChange={(e) =>
            set('condition', e.target.value as NewProductInput['condition'])
          }
          options={conditions.map((c) => ({ value: c, label: c }))}
        />
        <Input
          label="Colour / material"
          placeholder="Black Caviar"
          value={form.color}
          onChange={(e) => set('color', e.target.value)}
          invalid={!!errors.color}
          hint={errors.color}
        />
        <Input
          label="Purchase price"
          type="number"
          min={0}
          leftIcon={<span className="text-sm">$</span>}
          value={form.purchasePrice || ''}
          onChange={(e) => set('purchasePrice', Number(e.target.value))}
          invalid={!!errors.purchasePrice}
          hint={errors.purchasePrice}
        />
        <Input
          label="Selling price"
          type="number"
          min={0}
          leftIcon={<span className="text-sm">$</span>}
          value={form.sellingPrice || ''}
          onChange={(e) => set('sellingPrice', Number(e.target.value))}
          invalid={!!errors.sellingPrice}
          hint={errors.sellingPrice}
        />
        <Input
          label="Stock quantity"
          type="number"
          min={0}
          value={form.stock}
          onChange={(e) => set('stock', Math.max(0, Number(e.target.value)))}
        />
        <div className="flex items-end">
          <div className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-ink-500">Profit / unit</span>
              <span className="font-semibold text-ink-900 tabular-nums">
                {formatCurrency(profit)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-ink-500">Margin</span>
              <span className="font-semibold text-accent-700 tabular-nums">
                {margin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
