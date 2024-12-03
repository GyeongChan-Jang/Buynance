import { useEffect, useState } from 'react'

interface TickerData {
  lastPrice: number
  priceChange: number
  priceChangePercent: number
  highPrice: number
  volume: number
  isConnected: boolean
}

export const useTickerData = (symbol: string) => {
  const [tickerData, setTickerData] = useState<TickerData>({
    lastPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    volume: 0,
    isConnected: false
  })

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`)

    ws.onopen = () => {
      setTickerData((prev) => ({ ...prev, isConnected: true }))
    }

    ws.onclose = () => {
      setTickerData((prev) => ({ ...prev, isConnected: false }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTickerData({
        lastPrice: parseFloat(data.c),
        priceChange: parseFloat(data.p),
        priceChangePercent: parseFloat(data.P),
        highPrice: parseFloat(data.h),
        volume: parseFloat(data.v),
        isConnected: true
      })
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [symbol])

  return tickerData
}
