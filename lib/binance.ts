import { Spot } from '@binance/connector-typescript'
import { WebsocketStream } from '@binance/connector-typescript'

// API 키가 필요한 경우에만 설정
const API_KEY = process.env.NEXT_PUBLIC_BINANCE_API_KEY
const API_SECRET = process.env.NEXT_PUBLIC_BINANCE_SECRET_KEY

export const spotClient = new Spot(API_KEY, API_SECRET)

const callbacks = {
  open: () => console.debug('Connected to WebSocket server'), // 연결이 열렸을 때
  close: () => console.debug('Disconnected from WebSocket server'), // 연결이 닫혔을 때
  message: (data: string) => console.info(data) // 메시지 수신 시 처리
}

export const wsClient = new WebsocketStream({ callbacks })
