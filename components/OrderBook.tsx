'use client'

import { useOrderBookData } from '@/hooks/queries/useOrderBookData'
import { cn } from '@/lib/utils'

interface OrderBookProps {
  symbol: string
  onPriceSelect: (price: number) => void
}

export const OrderBook = ({ symbol, onPriceSelect }: OrderBookProps) => {
  const { orderBook, isConnected } = useOrderBookData(symbol)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    }).format(amount)
  }

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

      <div className="flex-1 flex flex-col text-xs">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full h-full relative">
            <thead className="sticky top-0 bg-card">
              <tr className="text-muted-foreground">
                <th className="p-1 text-left w-[30%]">Price(USDT)</th>
                <th className="p-1 text-right w-[40%]">Amount(BTC)</th>
                <th className="p-1 text-right w-[30%]">Total(USDT)</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.slice(0, 15).map((ask, i) => (
                <tr
                  key={i}
                  className="relative hover:bg-accent/50 cursor-pointer"
                  onClick={() => onPriceSelect(ask.price)}
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
        <div className="p-2 text-center border-y bg-accent/50">
          <span className="text-sm font-bold">
            {orderBook.bids[0]?.price ? `$${formatPrice(orderBook.bids[0].price)}` : '-'}
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full h-full relative">
            <tbody>
              {orderBook.bids.slice(0, 15).map((bid, i) => (
                <tr
                  key={i}
                  className="relative hover:bg-accent/50 cursor-pointer"
                  onClick={() => onPriceSelect(bid.price)}
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
