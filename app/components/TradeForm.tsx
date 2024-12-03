import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TradeFormProps {
  type: 'buy' | 'sell'
  price: string
  amount: string
  onPriceChange: (value: string) => void
  onAmountChange: (value: string) => void
  baseAsset?: string
  quoteAsset?: string
}

export function TradeForm({
  type,
  price,
  amount,
  onPriceChange,
  onAmountChange,
  baseAsset = 'BTC',
  quoteAsset = 'USDT'
}: TradeFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${type} order:`, { price, amount })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 border">
      <h2 className="text-lg font-bold mb-4">{type === 'buy' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Price ({quoteAsset})</label>
          <Input type="number" value={price} onChange={(e) => onPriceChange(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Amount ({baseAsset})</label>
          <Input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" className="w-full" variant={type === 'buy' ? 'default' : 'destructive'}>
          {type === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
        </Button>
      </div>
    </form>
  )
}
