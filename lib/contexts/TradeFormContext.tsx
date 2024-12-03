'use client'

import React, { createContext, useContext, useState } from 'react'

interface TradeFormState {
  buy: {
    price: string
    amount: string
  }
  sell: {
    price: string
    amount: string
  }
}

interface TradeFormContextType {
  tradeForm: TradeFormState
  updateBuyForm: (price: string, amount: string) => void
  updateSellForm: (price: string, amount: string) => void
  updateForm: (type: 'buy' | 'sell', field: 'price' | 'amount', value: string) => void
}

const TradeFormContext = createContext<TradeFormContextType | undefined>(undefined)

export function TradeFormProvider({ children }: { children: React.ReactNode }) {
  const [tradeForm, setTradeForm] = useState<TradeFormState>({
    buy: { price: '', amount: '' },
    sell: { price: '', amount: '' }
  })

  const updateBuyForm = (price: string, amount: string) => {
    setTradeForm((prev) => ({
      ...prev,
      buy: { price, amount }
    }))
  }

  const updateSellForm = (price: string, amount: string) => {
    setTradeForm((prev) => ({
      ...prev,
      sell: { price, amount }
    }))
  }

  const updateForm = (type: 'buy' | 'sell', field: 'price' | 'amount', value: string) => {
    setTradeForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  return (
    <TradeFormContext.Provider value={{ tradeForm, updateBuyForm, updateSellForm, updateForm }}>
      {children}
    </TradeFormContext.Provider>
  )
}

export function useTradeForm() {
  const context = useContext(TradeFormContext)
  if (context === undefined) {
    throw new Error('useTradeForm must be used within a TradeFormProvider')
  }
  return context
}
