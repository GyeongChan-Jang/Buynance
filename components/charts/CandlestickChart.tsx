import { useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

// Highcharts 모듈 추가
import indicators from 'highcharts/indicators/indicators'
import dragPanes from 'highcharts/modules/drag-panes'
import annotationsAdvanced from 'highcharts/modules/annotations-advanced'
import priceIndicator from 'highcharts/modules/price-indicator'
import fullScreen from 'highcharts/modules/full-screen'
import stockTools from 'highcharts/modules/stock-tools'

// 모듈 초기화
if (typeof Highcharts === 'object') {
  indicators(Highcharts)
  dragPanes(Highcharts)
  annotationsAdvanced(Highcharts)
  priceIndicator(Highcharts)
  fullScreen(Highcharts)
  stockTools(Highcharts)
}

interface CandlestickChartProps {
  data: [number, number, number, number, number][] // [timestamp, open, high, low, close]
}

const CandlestickChart = ({ data }: CandlestickChartProps) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      height: 600,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'BTC/USDT',
      style: {
        color: '#fff'
      }
    },
    rangeSelector: {
      buttons: [
        {
          type: 'hour',
          count: 1,
          text: '1h'
        },
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'week',
          count: 1,
          text: '1w'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'year',
          count: 1,
          text: '1y'
        },
        {
          type: 'all',
          text: 'All'
        }
      ],
      selected: 2
    },
    yAxis: [
      {
        labels: {
          style: {
            color: '#fff'
          }
        },
        title: {
          text: 'Price',
          style: {
            color: '#fff'
          }
        }
      }
    ],
    xAxis: {
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    series: [
      {
        type: 'candlestick',
        name: 'BTC/USDT',
        data: data,
        color: '#ef4444', // 하락봉 색상
        upColor: '#22c55e', // 상승봉 색상
        lineColor: '#ef4444', // 하락봉 테두리
        upLineColor: '#22c55e' // 상승봉 테두리
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
    }
  }

  return <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
}

export default CandlestickChart
