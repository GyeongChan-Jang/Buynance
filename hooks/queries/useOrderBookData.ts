import { useEffect, useState } from 'react'

interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export const useOrderBookData = (symbol: string) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`)

    ws.onopen = () => {
      console.debug('OrderBook WebSocket Connected')
      setIsConnected(true)
    }

    ws.onclose = () => {
      console.debug('OrderBook WebSocket Disconnected')
      setIsConnected(false)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      const processOrders = (orders: [string, string][]): OrderBookEntry[] => {
        let total = 0

        return orders.map(([price, quantity]) => {
          total += parseFloat(price) * parseFloat(quantity)
          return {
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            total
          }
        })
      }

      setOrderBook({
        bids: processOrders(data.bids),
        asks: processOrders(data.asks.reverse())
      })
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [symbol])

  return {
    orderBook,
    isConnected
  }
}
