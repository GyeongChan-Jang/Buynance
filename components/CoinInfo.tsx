'use client'

import { useTickerData } from '@/hooks/queries/useTickerData'
import { cn } from '@/lib/utils'
import { formatPrice, formatPriceChange, formatPercentChange, formatVolume } from '@/utils/formatting'
import { useEffect, useRef, useState } from 'react'

interface CoinInfoProps {
  symbol: string
  baseAsset: string
  quoteAsset: string
}

export const CoinInfo = ({ symbol, baseAsset, quoteAsset }: CoinInfoProps) => {
  const { lastPrice, priceChange, priceChangePercent, highPrice, volume, isConnected } = useTickerData(symbol)
  const prevPriceRef = useRef(lastPrice)
  const [priceFlash, setPriceFlash] = useState<'flash-green' | 'flash-red' | null>(null)

  useEffect(() => {
    if (prevPriceRef.current !== lastPrice && lastPrice !== undefined) {
      setPriceFlash(lastPrice > prevPriceRef.current ? 'flash-green' : 'flash-red')
      const timer = setTimeout(() => setPriceFlash(null), 1000)
      prevPriceRef.current = lastPrice
      return () => clearTimeout(timer)
    }
  }, [lastPrice])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-card rounded-lg border mb-4">
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            {baseAsset}/{quoteAsset}
          </h1>
          <span className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xl font-semibold tabular-nums',
              priceFlash && 'animate-flash',
              priceFlash === 'flash-green' && 'text-green-500',
              priceFlash === 'flash-red' && 'text-red-500'
            )}
          >{`$${formatPrice(lastPrice)}`}</span>
          <span
            className={cn(
              'text-sm font-medium min-w-[80px] tabular-nums',
              priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {formatPercentChange(priceChangePercent)}
          </span>
        </div>
      </div>
      <div className="flex gap-6 text-sm">
        <div className="min-w-[160px]">
          <div className="text-muted-foreground">24h Change</div>
          <div className={cn('font-medium tabular-nums', priceChange >= 0 ? 'text-green-500' : 'text-red-500')}>
            {formatPriceChange(priceChange)}
            &nbsp;
            {formatPercentChange(priceChangePercent)}
          </div>
        </div>
        <div className="min-w-[120px]">
          <div className="text-muted-foreground">24h High</div>
          <div className="font-medium tabular-nums">{formatPrice(highPrice)}</div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-muted-foreground">24h Volume</div>
          <div className="font-medium tabular-nums">
            {formatVolume(volume)} {baseAsset}
          </div>
        </div>
      </div>
    </div>
  )
}
