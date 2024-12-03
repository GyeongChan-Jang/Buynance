'use client'

import { useTradeForm } from '@/lib/contexts/TradeFormContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TradeFormProps {
  type: 'buy' | 'sell'
  baseAsset?: string
  quoteAsset?: string
}

export function TradeForm({ type, baseAsset, quoteAsset }: TradeFormProps) {
  const { tradeForm, updateForm } = useTradeForm()
  const formData = type === 'buy' ? tradeForm.buy : tradeForm.sell

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm(type, 'price', e.target.value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm(type, 'amount', e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${type} order:`, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-3 border">
      <h2 className="text-lg font-bold mb-2">{type === 'buy' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}</h2>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Price ({quoteAsset})</label>
            <Input type="number" value={formData.price} onChange={handlePriceChange} className="mt-1" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Amount ({baseAsset})</label>
            <Input type="number" value={formData.amount} onChange={handleAmountChange} className="mt-1" />
          </div>
        </div>
        <Button type="submit" className="w-full" variant={type === 'buy' ? 'default' : 'destructive'}>
          {type === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
        </Button>
      </div>
    </form>
  )
}
