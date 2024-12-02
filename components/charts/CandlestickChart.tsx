'use client'

import { useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

interface CandlestickChartProps {
  data: [number, number, number, number, number][]
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const options: Highcharts.Options = {
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
    // rangeSelector: {
    //   buttons: [{
    //     type: 'minute',
    //     count: 15,
    //     text: '15m'
    //   }, {
    //     type: 'hour',
    //     count: 1,
    //     text: '1h'
    //   }, {
    //     type: 'day',
    //     count: 1,
    //     text: '1d'
    //   }, {
    //     type: 'all',
    //     text: 'All'
    //   }],
    //   selected: 1,
    //   inputEnabled: false
    // },
    yAxis: [
      {
        labels: {
          align: 'right',
          style: {
            color: '#888'
          }
        },
        title: {
          text: 'Price'
        },
        height: '70%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: 'right',
          style: {
            color: '#888'
          }
        },
        title: {
          text: 'Volume'
        },
        top: '72%',
        height: '28%',
        offset: 0,
        lineWidth: 2
      }
    ],
    series: [
      {
        type: 'candlestick',
        name: 'BTC/USDT',
        data: data,
        color: '#ef4444',
        upColor: '#22c55e',
        lineColor: '#ef4444',
        upLineColor: '#22c55e'
      }
    ],
    tooltip: {
      split: false,
      formatter: function () {
        const point = this.point as any
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
  }

  useEffect(() => {
    // 차트 업데이트
    if (chartRef.current) {
      chartRef.current.chart.series[0].setData(data)
    }
  }, [data])

  return (
    <div className="w-full h-full">
      <HighchartsReact ref={chartRef} highcharts={Highcharts} constructorType={'stockChart'} options={options} />
    </div>
  )
}

export default CandlestickChart
