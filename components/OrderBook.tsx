'use client'

import { useOrderBookData } from '@/hooks/queries/useOrderBookData'
import { cn, formatPrice, formatAmount } from '@/utils/formatting'
import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useTradeForm } from '@/lib/contexts/TradeFormContext'

interface OrderBookProps {
  symbol: string
  baseAsset: string
  quoteAsset: string
}

export const OrderBook = ({ symbol, baseAsset, quoteAsset }: OrderBookProps) => {
  const { orderBook, isConnected } = useOrderBookData(symbol)
  const prevPriceRef = useRef(orderBook.bids[0]?.price)
  const [priceFlash, setPriceFlash] = useState<'flash-green' | 'flash-red' | null>(null)
  const { updateBuyForm, updateSellForm } = useTradeForm()

  useEffect(() => {
    const currentPrice = orderBook.bids[0]?.price
    if (prevPriceRef.current !== currentPrice && currentPrice !== undefined) {
      setPriceFlash(currentPrice > prevPriceRef.current ? 'flash-green' : 'flash-red')
      const timer = setTimeout(() => setPriceFlash(null), 1000)
      prevPriceRef.current = currentPrice
      return () => clearTimeout(timer)
    }
  }, [orderBook.bids])

  // console.log(orderBook)

  const formatTotal = (total: number) => {
    if (total >= 1000000) {
      return `${(total / 1000000).toFixed(1)}M`
    }
    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}K`
    }
    return total.toFixed(2)
  }

  // 각 섹션(asks/bids)별로 최대 total 값 계산
  const maxAskTotal = Math.max(...orderBook.asks.map((ask) => ask.total))
  const maxBidTotal = Math.max(...orderBook.bids.map((bid) => bid.total))

  const handleBuyClick = (price: number, amount: number) => {
    updateBuyForm(price.toString(), amount.toString())
  }

  const handleSellClick = (price: number, amount: number) => {
    updateSellForm(price.toString(), amount.toString())
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">
        <h2 className="font-bold text-lg flex items-center gap-2">
          Order Book
          {isConnected ? (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          )}
        </h2>
      </div>

      <div className="flex-1 flex flex-col text-xs md:flex-col">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-hidden min-h-[200px]">
          <table className="w-full h-full relative">
            <thead className="sticky top-0 bg-card">
              <tr className="text-muted-foreground">
                <th className="p-1 text-left w-[30%]">Price({quoteAsset})</th>
                <th className="p-1 text-right w-[40%]">Amount({baseAsset})</th>
                <th className="p-1 text-right w-[30%]">Total({quoteAsset})</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.slice(0, 14).map((ask, i) => (
                <tr
                  key={i}
                  className="relative hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleSellClick(ask.price, ask.quantity)}
                >
                  <td className="p-1 text-red-500 relative z-10 w-[30%]">{formatPrice(ask.price)}</td>
                  <td className="p-1 text-right relative z-10 w-[40%]">{formatAmount(ask.quantity)}</td>
                  <td className="p-1 text-right relative z-10 w-[30%]">{formatTotal(ask.total)}</td>
                  <td className="absolute inset-0 z-0">
                    <div
                      className="h-full bg-red-500/10"
                      style={{ width: `${(ask.total / maxAskTotal) * 100}%`, marginLeft: 'auto' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Price */}
        <div className="p-2 text-center border-y bg-accent/50 flex items-center justify-center gap-2">
          <span
            className={cn(
              'text-sm font-bold tabular-nums',
              priceFlash && 'animate-flash',
              priceFlash === 'flash-green' && 'text-green-500',
              priceFlash === 'flash-red' && 'text-red-500'
            )}
          >
            {orderBook.bids[0]?.price ? `$${formatPrice(orderBook.bids[0].price)}` : '-'}
          </span>
          {priceFlash === 'flash-green' && <ArrowUp size={14} className="text-green-500" />}
          {priceFlash === 'flash-red' && <ArrowDown size={14} className="text-red-500" />}
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-hidden min-h-[200px]">
          <table className="w-full h-full relative">
            <tbody>
              {orderBook.bids.slice(0, 14).map((bid, i) => (
                <tr
                  key={i}
                  className="relative hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleBuyClick(bid.price, bid.quantity)}
                >
                  <td className="p-1 text-green-500 relative z-10 w-[30%]">{formatPrice(bid.price)}</td>
                  <td className="p-1 text-right relative z-10 w-[40%]">{formatAmount(bid.quantity)}</td>
                  <td className="p-1 text-right relative z-10 w-[30%]">{formatTotal(bid.total)}</td>
                  <td className="absolute inset-0 z-0">
                    <div
                      className="h-full bg-green-500/10"
                      style={{ width: `${(bid.total / maxBidTotal) * 100}%`, marginLeft: 'auto' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
