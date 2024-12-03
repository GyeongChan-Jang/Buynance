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
    <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between p-4 bg-card rounded-lg border mb-4">
      <div className="flex items-center gap-4 min-w-[220px]">
        <div className="flex items-center gap-2">
          <h1 className="text-md font-bold">
            {baseAsset}/{quoteAsset}
          </h1>
          <span className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-md font-semibold tabular-nums',
              priceFlash && 'animate-flash',
              priceFlash === 'flash-green' && 'text-green-500',
              priceFlash === 'flash-red' && 'text-red-500'
            )}
          >{`$${formatPrice(lastPrice)}`}</span>
          <span
            className={cn(
              'text-xs font-medium min-w-[80px] tabular-nums',
              priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {formatPercentChange(priceChangePercent)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 text-xs">
        <div className="min-w-[140px]">
          <div className="text-xs text-muted-foreground">24h Change</div>
          <div className={cn('text-xs font-medium tabular-nums', priceChange >= 0 ? 'text-green-500' : 'text-red-500')}>
            {formatPriceChange(priceChange)}
            &nbsp;
            {formatPercentChange(priceChangePercent)}
          </div>
        </div>
        <div className="min-w-[100px]">
          <div className="text-xs text-muted-foreground">24h High</div>
          <div className="text-xs font-medium tabular-nums">{formatPrice(highPrice)}</div>
        </div>
        <div className="min-w-[80px]">
          <div className="text-xs text-muted-foreground">24h Volume</div>
          <div className="text-xs font-medium tabular-nums">
            {formatVolume(volume)} {baseAsset}
          </div>
        </div>
      </div>
    </div>
  )
}
