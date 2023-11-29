import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import './ChartStyles.css';

const App = () => {
  const chartRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const [days, setDays] = useState(30);

useEffect(() => {
    if (!chartRef.current) {
        return;
    }
        
    const chart = createChart(chartRef.current, {
        width: 800,
        height: 400,
        layout: {
            background: {
                type: 'solid',
                color: '#000000',
            },
            textColor: '#d1d4dc',
        },
        grid: {
            vertLines: {
                visible: false,
            },
            horzLines: {
                color: 'rgba(42, 46, 57, 0.5)',
            },
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
        crosshair: {
            horzLine: {
                visible: false,
            },
        },
    });

    const lineSeries = chart.addLineSeries({
        color: 'rgba(4, 111, 232, 1)',
        lineWidth: 2
    });

    lineSeriesRef.current = lineSeries;
  }, []);
    
  useEffect(() => {
    const fetchChartData = async (days) => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
        );

        const chartData = response.data.prices.map((price) => ({
          time: price[0] / 1000,
          value: price[1]
        }));

        lineSeriesRef.current.setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData(days);
  }, [days]);

  const handleSwitcherClick = (newDays) => {
    if (newDays !== days) {
      setDays(newDays);
    }
  };

  return (
    <div>
      <h1>BTC/USD Line Chart</h1>
      <div className="switcher">
        <button
          className={`switcher-item ${days === 30 ? 'switcher-active-item' : ''}`}
          onClick={() => handleSwitcherClick(30)}
        >
          30 days
        </button>
        <button
          className={`switcher-item ${days === 90 ? 'switcher-active-item' : ''}`}
          onClick={() => handleSwitcherClick(90)}
        >
          90 days
        </button>
      </div>
      <div ref={chartRef} style={{ width: '800px', height: '400px' }}></div>
    </div>
  );
};

export default App;
