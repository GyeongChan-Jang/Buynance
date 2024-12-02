import { atom } from 'recoil'

export const selectedPairState = atom({
  key: 'selectedPairState',
  default: 'BTCUSDT'
})

export const orderBookState = atom({
  key: 'orderBookState',
  default: {
    bids: [],
    asks: []
  }
})
