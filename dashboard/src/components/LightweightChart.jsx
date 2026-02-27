import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

/**
 * LightweightChart - 轻量级图表组件
 * 使用 TradingView lightweight-charts 替代 Recharts
 * 包大小: ~60KB vs Recharts 541KB (减少 89%)
 */

export function AreaChartLW({ data, height = 200, color = '#00ffc2' }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
    });

    // 创建面积图系列
    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}4D`, // 30% opacity
      bottomColor: `${color}00`, // 0% opacity
      lineWidth: 2,
    });

    // 转换数据格式
    const formattedData = data.map(item => ({
      time: new Date(item.time || item.timestamp).getTime() / 1000,
      value: item.odds || item.value || 0,
    }));

    areaSeries.setData(formattedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    // 响应式调整
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height, color]);

  return <div ref={chartContainerRef} />;
}

export function LineChartLW({ data, height = 300, lines = [] }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
    });

    // 为每条线创建系列
    lines.forEach(line => {
      const lineSeries = chart.addLineSeries({
        color: line.color || '#00ffc2',
        lineWidth: 2,
        title: line.name,
      });

      const formattedData = data.map(item => ({
        time: new Date(item.date || item.timestamp).getTime() / 1000,
        value: item[line.dataKey] || 0,
      }));

      lineSeries.setData(formattedData);
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height, lines]);

  return <div ref={chartContainerRef} />;
}

export function BarChartLW({ data, height = 300, bars = [] }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
    });

    // 使用 Histogram 系列模拟柱状图
    bars.forEach(bar => {
      const histogramSeries = chart.addHistogramSeries({
        color: bar.color || '#00ffc2',
        priceFormat: {
          type: 'volume',
        },
      });

      const formattedData = data.map(item => ({
        time: new Date(item.date || item.hour || item.timestamp).getTime() / 1000,
        value: item[bar.dataKey] || 0,
        color: bar.color || '#00ffc2',
      }));

      histogramSeries.setData(formattedData);
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height, bars]);

  return <div ref={chartContainerRef} />;
}

// 简单的饼图组件 (lightweight-charts 不支持饼图，使用 CSS 实现)
export function PieChartLW({ data, height = 200 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="relative" style={{ width: height * 0.8, height: height * 0.8 }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            // 计算路径
            const startX = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 50 + 45 * Math.cos((currentAngle * Math.PI) / 180);
            const endY = 50 + 45 * Math.sin((currentAngle * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArc} 1 ${endX} ${endY} Z`}
                fill={item.color}
                opacity={0.8}
              />
            );
          })}
        </svg>

        {/* 图例 */}
        <div className="absolute -right-24 top-0 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-text-secondary">{item.name}</span>
              <span className="text-text-primary font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
