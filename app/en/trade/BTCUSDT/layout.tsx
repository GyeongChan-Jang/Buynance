'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/theme/ThemeToggle'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/theme/ThemeProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  const [showMarkets, setShowMarkets] = useState(false)
  const [showOrderBook, setShowOrderBook] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <div className="flex min-h-screen bg-background relative">
          {/* 모바일 토글 버튼들 */}
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden hover:bg-accent"
              onClick={() => setShowMarkets(!showMarkets)}
            >
              {showMarkets ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <ThemeToggle />
          </div>
          <div className="lg:hidden fixed top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-accent"
              onClick={() => setShowOrderBook(!showOrderBook)}
            >
              {showOrderBook ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* 왼쪽 사이드바 - 코인 목록 */}
          {/* <aside
            className={cn(
              'fixed lg:relative w-64 h-full',
              'bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75',
              'border-r border-border',
              'transition-transform duration-300 lg:transform-none',
              'shadow-lg lg:shadow-none',
              showMarkets ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
              'z-40'
            )}
          >
            <div className="p-4 pt-16 lg:pt-4">
              <h2 className="font-bold text-lg text-foreground">Markets</h2>
              
            </div>
          </aside> */}

          {/* 메인 컨텐츠 */}
          <main className="flex-1 w-full lg:w-auto">{children}</main>

          {/* 오른쪽 사이드바 - 주문북 */}
          {/* <aside
            className={cn(
              'fixed lg:relative right-0 w-80 h-full',
              'bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75',
              'border-l border-border',
              'transition-transform duration-300 lg:transform-none',
              'shadow-lg lg:shadow-none',
              showOrderBook ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
              'z-40'
            )}
          >
            <div className="p-4 pt-16 lg:pt-4">
              <h2 className="font-bold text-lg text-foreground">Order Book</h2>
            </div>
          </aside> */}
        </div>
      </RecoilRoot>
    </QueryClientProvider>
  )
}
