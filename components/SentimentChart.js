import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO, startOfHour, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const SentimentChart = ({ notes }) => {
  const [timeFrame, setTimeFrame] = useState('daily');

  const sentimentScores = {
    'Positive': 1,
    'Neutral': 0,
    'Negative': -1
  };

  const getStartOfPeriod = (date, period) => {
    switch (period) {
      case 'hourly': return startOfHour(date);
      case 'daily': return startOfDay(date);
      case 'weekly': return startOfWeek(date);
      case 'monthly': return startOfMonth(date);
      case 'yearly': return startOfYear(date);
      default: return date;
    }
  };

  const chartData = useMemo(() => {
    const groupedData = notes
      .filter(note => !note.isDone)
      .reduce((acc, note) => {
        const date = getStartOfPeriod(parseISO(note.createdAt), timeFrame);
        if (!acc[date]) {
          acc[date] = { sum: 0, count: 0 };
        }
        acc[date].sum += sentimentScores[note.sentiment];
        acc[date].count += 1;
        return acc;
      }, {});

    return Object.entries(groupedData)
      .map(([date, { sum, count }]) => ({
        x: new Date(date),
        y: sum / count
      }))
      .sort((a, b) => a.x - b.x);
  }, [notes, timeFrame]);

  const data = {
    datasets: [
      {
        label: 'Average Sentiment',
        data: chartData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeFrame === 'hourly' ? 'hour' : 
                timeFrame === 'daily' ? 'day' : 
                timeFrame === 'weekly' ? 'week' : 
                timeFrame === 'monthly' ? 'month' : 'year'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Sentiment'
        },
        min: -1,
        max: 1,
        ticks: {
          callback: function(value) {
            if (value === -1) return '😔';
            if (value === 0) return '😐';
            if (value === 1) return '😊';
            return '';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label) {
              const sentiment = context.parsed.y > 0.33 ? '😊' : 
                                context.parsed.y < -0.33 ? '😔' : '😐';
              return `${label}: ${sentiment} (${context.parsed.y.toFixed(2)})`;
            }
            return '';
          }
        }
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map((period) => (
          <button
            key={period}
            onClick={() => setTimeFrame(period)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: timeFrame === period ? '#4CAF50' : '#f8f9fa',
              color: timeFrame === period ? 'white' : '#4a4a4a',
              border: '1px solid #ced4da',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SentimentChart;
