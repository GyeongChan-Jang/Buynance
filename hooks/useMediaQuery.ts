import { useState, useEffect } from 'react'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const documentChangeHandler = () => setMatches(mediaQueryList.matches)

    // 초기 상태 설정
    setMatches(mediaQueryList.matches)

    // 이벤트 리스너 등록
    mediaQueryList.addEventListener('change', documentChangeHandler)

    // 클린업 함수
    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler)
    }
  }, [query])

  return matches
}

export default useMediaQuery 