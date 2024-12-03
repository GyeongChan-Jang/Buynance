import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | undefined): string {
  if (price === undefined) return '0'
  if (price === 0) return '0'

  if (price < 0.00001) {
    // 매우 작은 숫자는 과학적 표기법 대신 8자리까지 표시
    return price.toFixed(8)
  } else if (price < 0.1) {
    // 0.1보다 작은 숫자는 6자리까지 표시
    return price.toFixed(6)
  } else if (price < 1) {
    // 1보다 작은 숫자는 4자리까지 표시
    return price.toFixed(4)
  } else if (price < 10) {
    // 10보다 작은 숫자는 3자리까지 표시
    return price.toFixed(3)
  } else {
    // 그 외의 숫자는 2자리까지 표시
    return price.toFixed(2)
  }
}

export function formatAmount(amount: number | undefined): string {
  if (amount === undefined) return '0'
  if (amount === 0) return '0'

  // 1조 단위 이상
  if (amount >= 1000000000000) {
    return `${(amount / 1000000000000).toFixed(2)}T`
  }
  // 10억 단위 이상
  else if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2)}B`
  }
  // 백만 단위 이상
  else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`
  }
  // 천 단위 이상
  else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`
  }
  // 1보다 작은 수
  else if (amount < 1) {
    return amount.toPrecision(4)
  }
  // 그 외의 경우
  else {
    return amount.toFixed(2)
  }
}

export function formatVolume(volume: number | undefined): string {
  if (volume === undefined) return '0'
  if (volume === 0) return '0'

  // 1조 단위 이상
  if (volume >= 1000000000000) {
    return `${(volume / 1000000000000).toFixed(2)}T`
  }
  // 10억 단위 이상
  else if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(2)}B`
  }
  // 백만 단위 이상
  else if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`
  }
  // 천 단위 이상
  else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`
  }
  // 1보다 작은 수
  else if (volume < 1) {
    return volume.toPrecision(4)
  }
  // 그 외의 경우
  else {
    return volume.toFixed(2)
  }
}

// 가격 변화량에 대한 포맷팅 (+ 또는 - 기호 포함)
export function formatPriceChange(change: number | undefined): string {
  if (change === undefined) return '0'

  const sign = change >= 0 ? '+' : ''
  return `${sign}${formatPrice(change)}`
}

// 퍼센트 변화량에 대한 포맷팅 (% 기호 포함)
export function formatPercentChange(percent: number | undefined): string {
  if (percent === undefined) return '0%'

  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}
