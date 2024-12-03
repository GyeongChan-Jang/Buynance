import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

export interface MarketTicker {
  symbol: string
  lastPrice: number
  priceChange: number
  priceChangePercent: number
  volume: number
  quoteVolume: number
  baseAsset: string
  quoteAsset: string
}

type SortField = 'priceChangePercent' | 'lastPrice' | 'volume'
type SortOrder = 'asc' | 'desc'

export const useMarketData = (quoteAsset: string = 'USDT') => {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('volume')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const { data: tickers = [], isLoading } = useQuery({
    queryKey: ['marketTickers'],
    queryFn: async () => {
      const [tickerResponse, exchangeInfo] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/24hr'),
        fetch('https://api.binance.com/api/v3/exchangeInfo')
      ])

      const tickerData = await tickerResponse.json()
      const exchangeData = await exchangeInfo.json()

      const spotPairs = new Set(
        exchangeData.symbols
          .filter((symbol: any) => symbol.status === 'TRADING' && symbol.quoteAsset === quoteAsset)
          .map((symbol: any) => symbol.symbol)
      )

      return tickerData
        .filter((ticker: any) => spotPairs.has(ticker.symbol))
        .map((ticker: any) => ({
          symbol: ticker.symbol,
          baseAsset: ticker.symbol.replace(quoteAsset, ''),
          quoteAsset,
          lastPrice: parseFloat(ticker.lastPrice),
          priceChange: parseFloat(ticker.priceChange),
          priceChangePercent: parseFloat(ticker.priceChangePercent),
          volume: parseFloat(ticker.volume),
          quoteVolume: parseFloat(ticker.quoteVolume)
        }))
    },
    refetchInterval: 3000 // 3초마다 갱신
  })

  const filteredAndSortedData = useMemo(() => {
    if (!tickers) return []

    let filtered = tickers.filter((ticker: MarketTicker) =>
      ticker.baseAsset.toLowerCase().includes(search.toLowerCase())
    )

    return filtered.sort((a: MarketTicker, b: MarketTicker) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1
      return (a[sortField] - b[sortField]) * multiplier
    })
  }, [tickers, search, sortField, sortOrder])

  return {
    tickers: filteredAndSortedData,
    isLoading,
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder
  }
}
