'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/theme/ThemeToggle'
import { TradeFormProvider } from '@/lib/contexts/TradeFormContext'

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
      <TradeFormProvider>
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

          {/* 메인 컨텐츠 */}
          <main className="flex-1 w-full lg:w-auto">{children}</main>
        </div>
      </TradeFormProvider>
    </QueryClientProvider>
  )
}
