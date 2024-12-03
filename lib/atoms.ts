import { atom } from 'recoil'

export const orderBookState = atom({
  key: 'orderBookState',
  default: {
    bids: [],
    asks: []
  }
})
