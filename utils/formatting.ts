import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | undefined): string {
  if (price === undefined) return '0'
  if (price === 0) return '0'

  // 문자열로 변환하여 0이 아닌 마지막 숫자의 위치를 찾음
  const priceStr = price.toString()
  
  // 과학적 표기법으로 표시된 경우 처리
  if (priceStr.includes('e')) {
    const [mantissa, exponent] = priceStr.split('e')
    const exp = parseInt(exponent)
    if (exp < 0) {
      // 매우 작은 수의 경우 (예: 1.23e-7)
      return price.toFixed(Math.abs(exp))
    }
  }

  if (price < 1) {
    // 1보다 작은 수의 경우, 첫 번째 0이 아닌 숫자부터 유효한 숫자를 찾음
    const decimalStr = price.toString().split('.')[1]
    let significantDigits = 0
    let foundNonZero = false
    
    for (let i = 0; i < decimalStr.length; i++) {
      if (decimalStr[i] !== '0' && !foundNonZero) {
        foundNonZero = true
        significantDigits = i + 3 // 첫 번째 0이 아닌 숫자 이후 2자리까지 표시
      }
    }
    return price.toFixed(Math.min(significantDigits, 8)) // 최대 8자리까지만 표시
  } else {
    // 1 이상의 수는 소수점 자릿수를 확인
    const decimalPart = priceStr.split('.')[1]
    if (!decimalPart) return price.toFixed(0) // 정수인 경우
    
    // 소수점 이하 숫자 중 마지막 0이 아닌 숫자까지만 표시
    let lastNonZeroIndex = decimalPart.length - 1
    while (lastNonZeroIndex >= 0 && decimalPart[lastNonZeroIndex] === '0') {
      lastNonZeroIndex--
    }
    
    // 소수점 이하 2자리까지만 표시 (0이 아닌 경우)
    return price.toFixed(Math.min(lastNonZeroIndex + 1, 2))
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
