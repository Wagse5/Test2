import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, parseISO, startOfHour, startOfDay, startOfWeek, startOfMonth, startOfYear, addHours, addDays, addWeeks, addMonths, addYears } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

const SentimentChart = ({ notes }) => {
  const [timeFrame, setTimeFrame] = useState('hourly');
  const chartRef = useRef(null);

  const getStartOfPeriod = (date, period) => {
    const parsedDate = parseISO(date);
    switch (period) {
      case 'hourly': return startOfHour(parsedDate);
      case 'daily': return startOfDay(parsedDate);
      case 'weekly': return startOfWeek(parsedDate);
      case 'monthly': return startOfMonth(parsedDate);
      case 'yearly': return startOfYear(parsedDate);
      default: return parsedDate;
    }
  };

  const getSentimentValue = (sentiment) => {
    if (typeof sentiment === 'number') return sentiment;
    return sentiment === 'Positive' ? 1 : sentiment === 'Negative' ? -1 : 0;
  };

  const processData = () => {
    if (!notes || notes.length === 0) return { labels: [], data: [] };

    const groupedData = notes.reduce((acc, note) => {
      if (!note.createdAt) return acc;
      const date = getStartOfPeriod(note.createdAt, timeFrame).toISOString();
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 };
      }
      acc[date].sum += getSentimentValue(note.sentiment);
      acc[date].count += 1;
      return acc;
    }, {});

    let sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    
    // If there's only one data point, add dummy points before and after
    if (sortedDates.length === 1) {
      const singleDate = new Date(sortedDates[0]);
      const addPeriod = {
        hourly: addHours,
        daily: addDays,
        weekly: addWeeks,
        monthly: addMonths,
        yearly: addYears
      }[timeFrame];

      const beforeDate = addPeriod(singleDate, -1).toISOString();
      const afterDate = addPeriod(singleDate, 1).toISOString();
      
      groupedData[beforeDate] = { sum: groupedData[sortedDates[0]].sum, count: 1 };
      groupedData[afterDate] = { sum: groupedData[sortedDates[0]].sum, count: 1 };
      sortedDates = [beforeDate, ...sortedDates, afterDate];
    }

    const data = sortedDates.map(date => ({
      x: new Date(date),
      y: groupedData[date].sum / groupedData[date].count
    }));

    return { labels: sortedDates, data };
  };

  const { labels, data } = processData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Sentiment',
        data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.6,
      },
    ],
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
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sentiment Over Time'
      },
      filler: {
        propagate: true
      }
    },
    elements: {
      line: {
        tension: 0.6
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
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SentimentChart;
