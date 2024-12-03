'use client'

import { useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import { formatPrice, formatVolume } from '@/utils/formatting'

interface CandlestickChartProps {
  data: [number, number, number, number, number][]
  interval: string
  onIntervalChange: (interval: string) => void
  baseAsset: string
  quoteAsset: string
}

const intervals = [
  { label: '1s', value: '1s' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' }
]

const defaultIntervals = ['1s', '15m', '1h', '1d']

const CandlestickChart = ({ data, interval, onIntervalChange, baseAsset, quoteAsset }: CandlestickChartProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const { theme } = useTheme()

  const selectedInterval = intervals.find((int) => int.value === interval)
  const isDefaultInterval = defaultIntervals.includes(interval)

  const getOptions = (isDark: boolean): Highcharts.Options => ({
    chart: {
      type: 'candlestick',
      height: '100%',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      panning: {
        enabled: true,
        type: 'xy'
      },
      panKey: 'shift',
      zooming: {
        type: 'xy'
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
          align: 'left',
          x: 8,
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          },
          formatter: function () {
            return formatPrice(this.value as number)
          }
        },
        opposite: true,
        title: {
          text: 'Price',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          },
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          x: -8
        },
        height: '40%',
        lineWidth: 2,
        resize: {
          enabled: true
        },
        gridLineColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        minPadding: 0.1,
        maxPadding: 0.1,
        startOnTick: false,
        endOnTick: false,
        alignTicks: false,
        softMin: undefined,
        softMax: undefined
      },
      {
        labels: {
          align: 'left',
          x: 8,
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          },
          formatter: function () {
            return formatVolume(this.value as number)
          }
        },
        opposite: true,
        title: {
          text: 'Volume',
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          },
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          x: -8
        },
        top: '72%',
        height: '28%',
        offset: 0,
        lineWidth: 2,
        gridLineColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        minPadding: 0.1,
        maxPadding: 0.1,
        startOnTick: false,
        endOnTick: false,
        alignTicks: false
      }
    ],
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      labels: {
        style: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      }
    },
    plotOptions: {
      candlestick: {
        maxPointWidth: 15,
        cropThreshold: 500
      },
      series: {
        animation: false,
        dataGrouping: {
          enabled: true,
          groupPixelWidth: 5
        }
      }
    },
    series: [
      {
        type: 'candlestick',
        name: `${baseAsset}/${quoteAsset}`,
        data: data,
        color: 'hsl(var(--down-color))',
        upColor: 'hsl(var(--up-color))',
        lineColor: 'hsl(var(--down-color))',
        upLineColor: 'hsl(var(--up-color))'
      }
      // {
      //   type: 'column',
      //   name: 'Volume',
      //   data: data.map(([timestamp, open, _, __, close]) => ({
      //     x: timestamp,
      //     y: 0,
      //     color: open < close ? 'hsla(var(--up-color), 0.5)' : 'hsla(var(--down-color), 0.5)'
      //   })),
      //   yAxis: 1
      // }
    ],
    tooltip: {
      shared: true,
      formatter: function (this: any) {
        const point = this.points?.[0]?.options || this.point

        const candleData = point as any
        return `<b>${Highcharts.dateFormat('%Y-%m-%d %H:%M', point.x)}</b><br/>
                Open: ${formatPrice(candleData.open)}<br/>
                High: ${formatPrice(candleData.high)}<br/>
                Low: ${formatPrice(candleData.low)}<br/>
                Close: ${formatPrice(candleData.close)}<br/>
                `
      }
    },
    navigator: {
      enabled: true,
      height: 30,
      margin: 24,
      series: {
        color: isDark ? '#e5e7eb' : '#374151',
        lineWidth: 1
      },
      xAxis: {
        labels: {
          style: {
            color: isDark ? '#e5e7eb' : '#374151'
          }
        }
      }
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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 p-4">
        {defaultIntervals.map((int) => (
          <Button
            key={int}
            size="sm"
            variant={interval === int ? 'default' : 'secondary'}
            onClick={() => onIntervalChange(int)}
          >
            {int}
          </Button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              {!isDefaultInterval ? selectedInterval?.label : 'More'} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-2 gap-2">
              {intervals.map((int) => (
                <Button
                  key={int.value}
                  size="sm"
                  variant={interval === int.value ? 'default' : 'ghost'}
                  onClick={() => {
                    onIntervalChange(int.value)
                  }}
                  className="w-full"
                >
                  {int.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1">
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={getOptions(theme === 'dark')}
        />
      </div>
    </div>
  )
}

export default CandlestickChart
