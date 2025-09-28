import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';

const typeStrategies = {
  BUY: {
    bg: '#f0fdf4',
    border: '1.5px solid #22c55e',
    color: '#22c55e',
    label: 'Buy',
  },
  SELL: {
    bg: '#fef2f2',
    border: '1.5px solid #dc2626',
    color: '#dc2626',
    label: 'Sell',
  },
};

function TypeChip({ type }) {
  const strategy = typeStrategies[type] || typeStrategies.BUY;
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
    }}>{strategy.label}</span>
  );
}

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem('user_id');
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/api/transaction/buyer/${userId}`);
        setTransactions(res.data);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#2563eb', marginBottom: '1.2em' }}>Transaction History</h2>
      {loading ? <div>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f0f6ff', color: '#2563eb' }}>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Symbol</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Type</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Price</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Quantity</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{tx.stock_id?.symbol || '-'}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{tx.stock_id?.company_name || '-'}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}><TypeChip type={tx.transaction_type} /></td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>$ {tx.price}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{tx.quantity}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{new Date(tx.executed_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transaction;
