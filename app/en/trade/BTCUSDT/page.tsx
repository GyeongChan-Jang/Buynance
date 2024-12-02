'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useCandlestickData } from '@/hooks/queries/useCandlestickData'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Highcharts를 클라이언트 사이드에서만 로드하도록 설정
const CandlestickChart = dynamic(() => import('@/components/charts/CandlestickChart'), { ssr: false })

type Interval = '15m' | '1h' | '1d' | '1w'

export default function TradePage() {
  const [interval, setInterval] = useState<Interval>('15m')
  const { data, isLoading, isWebSocketConnected } = useCandlestickData('BTCUSDT', interval)

  const intervals: { value: Interval; label: string }[] = [
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: 'All' },
  ]

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
      {/* 헤더 영역 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50 p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">BTC/USDT</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {isWebSocketConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Live</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Disconnected</span>
              </>
            )}
          </p>
        </div>
        
        {/* 인터벌 선택 버튼 그룹 */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {intervals.map((int) => (
            <Button
              key={int.value}
              variant={interval === int.value ? "default" : "secondary"}
              size="sm"
              onClick={() => setInterval(int.value)}
              className={cn(
                "min-w-[60px] transition-colors",
                interval === int.value 
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/80"
              )}
            >
              {int.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 min-h-[500px] bg-card rounded-lg overflow-hidden border">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-lg text-muted-foreground">Loading chart...</span>
          </div>
        ) : (
          <CandlestickChart data={data as [number, number, number, number, number][]} />
        )}
      </div>

      {/* 거래 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-bold mb-4 text-foreground">Buy</h2>
          {/* 매수 컴포넌트 추가 예정 */}
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-bold mb-4 text-foreground">Sell</h2>
          {/* 매도 컴포넌트 추가 예정 */}
        </div>
      </div>
    </div>
  )
}
