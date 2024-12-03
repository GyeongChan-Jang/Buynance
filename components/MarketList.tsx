'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MarketTicker, useMarketData } from '@/hooks/queries/useMarketData'
import { ArrowDown, ArrowUp, ArrowUpDown, RotateCw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MarketListProps {
  onSelect: (symbol: string) => void
  currentSymbol?: string
}

type ViewMode = 'volume' | 'change'
type SortField = 'baseAsset' | 'lastPrice' | 'priceChangePercent' | 'volume' | null

export const MarketList = ({ onSelect, currentSymbol }: MarketListProps) => {
  const { tickers, isLoading, search, setSearch } = useMarketData()
  const [viewMode, setViewMode] = useState<ViewMode>('volume')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') {
        setSortOrder('asc')
      } else if (sortOrder === 'asc') {
        setSortField(null)
        setSortOrder('asc')
      }
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />
    if (sortOrder === 'asc') return <ArrowUp className="h-3 w-3" />
    return <ArrowDown className="h-3 w-3" />
  }

  const formatNumber = (num: number, minimumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits: 8
    }).format(num)
  }

  const formatVolume = (volume: number) => {
    const millions = volume / 1000000
    return `${millions.toFixed(2)}M`
  }

  const sortedTickers = [...tickers].sort((a, b) => {
    if (!sortField) return 0

    const multiplier = sortOrder === 'desc' ? -1 : 1

    if (sortField === 'baseAsset') {
      return a.baseAsset.localeCompare(b.baseAsset) * multiplier
    }

    return (a[sortField] - b[sortField]) * multiplier
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="font-bold text-lg mb-3">USDT Markets</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pair..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_110px_110px] gap-1 p-1.5 border-b text-xs">
        <span
          className="cursor-pointer hover:text-accent-foreground font-medium flex items-center gap-1"
          onClick={() => handleSort('baseAsset')}
        >
          Pair
          {getSortIcon('baseAsset')}
        </span>
        <div className="flex items-center justify-center gap-0.5">
          <span
            className="cursor-pointer hover:text-accent-foreground text-right flex items-center gap-1"
            onClick={() => handleSort('lastPrice')}
          >
            Last Price
            {getSortIcon('lastPrice')}
          </span>
        </div>
        <div className="flex items-center justify-end gap-0.5">
          <span
            className="cursor-pointer hover:text-accent-foreground flex items-center gap-1"
            onClick={() => handleSort(viewMode === 'volume' ? 'volume' : 'priceChangePercent')}
          >
            {viewMode === 'volume' ? 'Vol' : '24h'}
            {viewMode === 'volume' ? getSortIcon('volume') : getSortIcon('priceChangePercent')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={() => setViewMode(viewMode === 'volume' ? 'change' : 'volume')}
          >
            <RotateCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-muted-foreground">Loading markets...</span>
          </div>
        ) : (
          <div className="divide-y">
            {sortedTickers.map((ticker: MarketTicker) => (
              <div
                key={ticker.symbol}
                className={cn(
                  'grid grid-cols-[1fr_110px_110px] gap-1 p-2 text-xs hover:bg-accent/50 cursor-pointer',
                  currentSymbol === ticker.symbol && 'bg-accent'
                )}
                onClick={() => onSelect(ticker.symbol)}
              >
                <div className="font-medium truncate">{ticker.baseAsset}</div>
                <div className="text-right">{formatNumber(ticker.lastPrice)}</div>
                {viewMode === 'volume' ? (
                  <div className="text-right">{formatVolume(ticker.volume)}</div>
                ) : (
                  <div className={cn('text-right', ticker.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {ticker.priceChangePercent.toFixed(2)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
