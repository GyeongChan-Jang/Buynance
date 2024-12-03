'use client'

import { useOrderBookData } from '@/hooks/queries/useOrderBookData'
import { cn } from '@/lib/utils'

interface OrderBookProps {
  symbol: string
  onPriceSelect: (price: number) => void
}

export const OrderBook = ({ symbol, onPriceSelect }: OrderBookProps) => {
  const { orderBook, isConnected } = useOrderBookData(symbol)

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg flex items-center gap-2">
          Order Book
          {isConnected ? (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card">
              <tr className="text-xs text-muted-foreground">
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.map((ask, i) => (
                <tr key={i} className="hover:bg-accent/50 cursor-pointer" onClick={() => onPriceSelect(ask.price)}>
                  <td className="p-2 text-red-500">{formatNumber(ask.price)}</td>
                  <td className="p-2 text-right">{formatNumber(ask.quantity)}</td>
                  <td className="p-2 text-right">{formatNumber(ask.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Price */}
        <div className="p-4 text-center border-y bg-accent/50">
          <span className="text-lg font-bold">
            {orderBook.bids[0]?.price ? formatNumber(orderBook.bids[0].price) : '-'}
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <tbody>
              {orderBook.bids.map((bid, i) => (
                <tr key={i} className="hover:bg-accent/50 cursor-pointer" onClick={() => onPriceSelect(bid.price)}>
                  <td className="p-2 text-green-500">{formatNumber(bid.price)}</td>
                  <td className="p-2 text-right">{formatNumber(bid.quantity)}</td>
                  <td className="p-2 text-right">{formatNumber(bid.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
