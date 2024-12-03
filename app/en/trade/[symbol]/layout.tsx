'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
  return (
    <QueryClientProvider client={queryClient}>
      <TradeFormProvider>
        <div className="flex min-h-screen bg-background relative">
          {/* 테마 토글 버튼만 유지 */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          {/* 메인 컨텐츠 */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </TradeFormProvider>
    </QueryClientProvider>
  )
}
