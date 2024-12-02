import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { spotClient } from '@/lib/binance'

interface KlineData {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
  quoteVolume: number
  trades: number
  baseAssetVolume: number
  quoteAssetVolume: number
}

interface KlineWebSocketData {
  e: string // 이벤트 타입
  E: number // 이벤트 시간
  s: string // 심볼
  k: {
    t: number // Kline 시작 시간
    T: number // Kline 종료 시간
    s: string // 심볼
    i: string // 인터벌
    f: number // First trade ID
    L: number // Last trade ID
    o: string // Open price
    c: string // Close price
    h: string // High price
    l: string // Low price
    v: string // Base asset volume
    n: number // Number of trades
    x: boolean // Is this kline closed?
    q: string // Quote asset volume
    V: string // Taker buy base asset volume
    Q: string // Taker buy quote asset volume
  }
}

export const useCandlestickData = (symbol: string, interval: string) => {
  const [realtimeData, setRealtimeData] = useState<KlineData[]>([])
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)

  // 초기 데이터 로드
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['candlestick', symbol, interval],
    queryFn: async () => {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
      )
      const data = await response.json()
      return data.map((item: any) => ({
        openTime: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
        closeTime: item[6],
        quoteVolume: parseFloat(item[7]),
        trades: item[8],
        baseAssetVolume: parseFloat(item[9]),
        quoteAssetVolume: parseFloat(item[10])
      }))
    }
  })

  useEffect(() => {
    // Binance WebSocket URL
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.debug('WebSocket Connected')
      setIsWebSocketConnected(true)
    }

    ws.onclose = () => {
      console.debug('WebSocket Disconnected')
      setIsWebSocketConnected(false)
    }

    ws.onmessage = (event) => {
      const parsedData: KlineWebSocketData = JSON.parse(event.data)
      
      if (parsedData.e === 'kline') {
        const { k } = parsedData
        const newKline: KlineData = {
          openTime: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          closeTime: k.T,
          quoteVolume: parseFloat(k.q),
          trades: k.n,
          baseAssetVolume: parseFloat(k.V),
          quoteAssetVolume: parseFloat(k.Q)
        }

        setRealtimeData((prevData) => {
          const updatedData = [...prevData]
          if (updatedData.length > 0 && updatedData[updatedData.length - 1].openTime === newKline.openTime) {
            updatedData[updatedData.length - 1] = newKline
          } else {
            updatedData.push(newKline)
          }
          return updatedData
        })
      }
    }

    // 클린업
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [symbol, interval])

  // 초기 데이터와 실시간 데이터 결합
  const combinedData = [...(initialData || []), ...realtimeData]

  // Highcharts 형식으로 데이터 변환
  const chartData = combinedData.map((item) => [item.openTime, item.open, item.high, item.low, item.close])

  return {
    data: chartData,
    isLoading,
    isWebSocketConnected
  }
}
