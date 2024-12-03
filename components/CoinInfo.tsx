'use client'

import { useTickerData } from '@/hooks/queries/useTickerData'
import { cn } from '@/lib/utils'

interface CoinInfoProps {
  symbol: string
  baseAsset: string
  quoteAsset: string
}

export const CoinInfo = ({ symbol, baseAsset, quoteAsset }: CoinInfoProps) => {
  const { lastPrice, priceChange, priceChangePercent, highPrice, volume, isConnected } = useTickerData(symbol)

  const formatNumber = (num: number, minimumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits: 8
    }).format(num)
  }

  const formatVolume = (vol: number) => {
    const millions = vol / 1000000
    return `${millions.toFixed(2)}M`
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            {baseAsset}/{quoteAsset}
          </h1>
          <span className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{`$${formatNumber(lastPrice)}`}</span>
          <span className={cn('text-sm font-medium', priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500')}>
            {priceChangePercent >= 0 ? '+' : ''}
            {priceChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <div className="text-muted-foreground">24h Change</div>
          <div className={cn('font-medium', priceChange >= 0 ? 'text-green-500' : 'text-red-500')}>
            {priceChange >= 0 ? '+' : ''}
            {formatNumber(priceChange)}
            &nbsp;
            {priceChangePercent >= 0 ? '+' : ''}
            {priceChangePercent.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">24h High</div>
          <div className="font-medium">{formatNumber(highPrice)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h Volume</div>
          <div className="font-medium">
            {formatVolume(volume)} {baseAsset}
          </div>
        </div>
      </div>
    </div>
  )
}
