import React from 'react';

// Strategy pattern for status chip styles
const statusStrategies = {
  Pending: {
    bg: '#fff7ed',
    border: '1.5px solid #f59e42',
    color: '#f59e42',
    label: 'Pending',
  },
  Executed: {
    bg: '#f0fdf4',
    border: '1.5px solid #22c55e',
    color: '#22c55e',
    label: 'Accepted',
  },
  Cancelled: {
    bg: '#fef2f2',
    border: '1.5px solid #dc2626',
    color: '#dc2626',
    label: 'Cancelled',
  },
};

export function OrderStatusChip({ status }) {
  const strategy = statusStrategies[status] || statusStrategies['Pending'];
  return (
    <span style={{
      background: strategy.bg,
      border: strategy.border,
      color: strategy.color,
      borderRadius: 8,
      padding: '0.3em 1.1em',
      fontWeight: 600,
      fontSize: '0.98em',
      display: 'inline-block',
      letterSpacing: '0.02em',
    }}>
      {strategy.label}
    </span>
  );
}
