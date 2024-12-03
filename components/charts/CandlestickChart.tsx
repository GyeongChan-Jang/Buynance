'use client'

import { useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { useTheme } from 'next-themes'

interface CandlestickChartProps {
  data: [number, number, number, number, number][]
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const { theme } = useTheme()

  const getOptions = (isDark: boolean): Highcharts.Options => ({
    chart: {
      type: 'candlestick',
      height: '100%',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    rangeSelector: {
      enabled: false
    },
    yAxis: [
      {
        labels: {
          align: 'right',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        },
        title: {
          text: 'Price',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        },
        height: '70%',
        lineWidth: 2,
        resize: {
          enabled: true
        },
        gridLineColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      },
      {
        labels: {
          align: 'right',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        },
        title: {
          text: 'Volume',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        },
        top: '72%',
        height: '28%',
        offset: 0,
        lineWidth: 2,
        gridLineColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    ],
    series: [
      {
        type: 'candlestick',
        name: 'BTC/USDT',
        data: data,
        color: 'hsl(var(--down-color))',
        upColor: 'hsl(var(--up-color))',
        lineColor: 'hsl(var(--down-color))',
        upLineColor: 'hsl(var(--up-color))'
      }
    ],
    tooltip: {
      split: false,
      formatter: function (this: any) {
        const point = this.points?.[0]?.options || this.point
        return `<b>Date:</b> ${Highcharts.dateFormat('%Y-%m-%d %H:%M', point.x)}<br/>
                <b>Open:</b> ${point.open}<br/>
                <b>High:</b> ${point.high}<br/>
                <b>Low:</b> ${point.low}<br/>
                <b>Close:</b> ${point.close}`
      }
    },
    navigator: {
      enabled: true
    },
    scrollbar: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  })

  useEffect(() => {
    if (chartRef.current) {
      const isDark = theme === 'dark'
      const newOptions = getOptions(isDark)
      chartRef.current.chart.update(newOptions, true)
    }
  }, [theme, data])

  return (
    <div className="w-full h-full">
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={getOptions(theme === 'dark')}
      />
    </div>
  )
}

export default CandlestickChart
