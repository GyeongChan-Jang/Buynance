'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useCandlestickData } from '@/hooks/queries/useCandlestickData'
import { OrderBook } from '@/components/OrderBook'
import { MarketList } from '@/components/MarketList'
import { CoinInfo } from '@/components/CoinInfo'
import { cn } from '@/lib/utils'
import { TradeForm } from '@/app/components/TradeForm'

const CandlestickChart = dynamic(() => import('@/components/charts/CandlestickChart'), { ssr: false })

export default function TradePage() {
  const params = useParams<{ symbol: string }>()
  const router = useRouter()
  const [interval, setInterval] = useState<string>('15m')
  const { data, isLoading } = useCandlestickData(params.symbol, interval)
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')

  const handlePriceSelect = (price: number, amount: number) => {
    setBuyPrice(price.toString())
    setSellPrice(price.toString())
    setBuyAmount(amount.toString())
    setSellAmount(amount.toString())
  }

  const handleMarketSelect = (symbol: string) => {
    router.push(`/en/trade/${symbol}`)
  }

  return (
    <div className="min-h-screen bg-background px-4 xl:px-8 py-4">
      <div className="flex flex-col md:flex-row max-w-[1920px] mx-auto h-[calc(100vh-2rem)]">
        {/* 왼쪽 사이드바 - 오더북 */}
        <aside
          className={cn(
            'w-full md:w-[320px] shrink-0',
            'min-w-[250px] max-w-[320px]',
            'h-[400px] md:h-full',
            'order-3 md:order-1',
            'border-t md:border-t-0 md:border-r',
            'flex flex-col'
          )}
        >
          <div className="flex-1 overflow-hidden">
            <OrderBook
              symbol={params.symbol}
              onPriceSelect={handlePriceSelect}
              baseAsset={params.symbol.split('USDT')[0]}
              quoteAsset="USDT"
            />
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className={cn('flex-1 flex flex-col', 'min-w-0', 'order-2 md:order-2', 'md:px-4', 'h-full')}>
          {/* 코인 정보 */}
          <CoinInfo symbol={params.symbol} baseAsset={params.symbol.split('USDT')[0]} quoteAsset="USDT" />

          {/* 차트 영역 */}
          <div className="flex-1 min-h-[400px] bg-card rounded-lg overflow-hidden border mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-lg text-muted-foreground">Loading chart...</span>
              </div>
            ) : (
              <CandlestickChart
                data={data as [number, number, number, number, number][]}
                interval={interval}
                onIntervalChange={setInterval}
                baseAsset={params.symbol.split('USDT')[0]}
                quoteAsset="USDT"
              />
            )}
          </div>

          {/* 거래 영역 - 태블릿/데스크톱 */}
          <div className="hidden md:grid grid-cols-2 gap-4 md:order-3">
            <TradeForm
              type="buy"
              price={buyPrice}
              amount={buyAmount}
              onPriceChange={setBuyPrice}
              onAmountChange={setBuyAmount}
              baseAsset={params.symbol.split('USDT')[0]}
              quoteAsset="USDT"
            />
            <TradeForm
              type="sell"
              price={sellPrice}
              amount={sellAmount}
              onPriceChange={setSellPrice}
              onAmountChange={setSellAmount}
              baseAsset={params.symbol.split('USDT')[0]}
              quoteAsset="USDT"
            />
          </div>
        </main>

        {/* 오른쪽 사이드바 - 마켓 리스트 */}
        <aside
          className={cn(
            'w-full md:w-[320px] shrink-0',
            'min-w-[250px] max-w-[320px]',
            'h-[400px] md:h-full',
            'order-4 md:order-3',
            'border-t md:border-t-0 md:border-l',
            'flex flex-col'
          )}
        >
          <div className="flex-1 overflow-hidden">
            <MarketList onSelect={handleMarketSelect} currentSymbol="BTCUSDT" />
          </div>
        </aside>

        {/* 거래 영역 - 모바일 */}
        <div className="md:hidden grid grid-cols-1 gap-4 order-5">
          <TradeForm
            type="buy"
            price={buyPrice}
            amount={buyAmount}
            onPriceChange={setBuyPrice}
            onAmountChange={setBuyAmount}
            baseAsset={params.symbol.split('USDT')[0]}
            quoteAsset="USDT"
          />
          <TradeForm
            type="sell"
            price={sellPrice}
            amount={sellAmount}
            onPriceChange={setSellPrice}
            onAmountChange={setSellAmount}
            baseAsset={params.symbol.split('USDT')[0]}
            quoteAsset="USDT"
          />
        </div>
      </div>
    </div>
  )
}
