import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { OrderStatusChip } from '../../components/order/OrderStatusChip';

const MyStocks = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem('user_id');
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/api/order/getOrdersByUserId/${userId}`);
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#2563eb', marginBottom: '1.2em' }}>My Orders</h2>
      {loading ? <div>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f0f6ff', color: '#2563eb' }}>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Symbol</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Company</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Type</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Price</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Quantity</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Date</th>
              <th style={{ textAlign: 'center', padding: '0.7em' }}>Sell</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{order.stock_id?.symbol || '-'}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{order.stock_id?.company_name || '-'}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{order.order_type}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>$ {order.price}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{order.quantity}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}><OrderStatusChip status={order.status} /></td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={{ textAlign: 'center', padding: '0.7em' }}>
                  <button
                    disabled={order.status !== 'Executed'}
                    style={{
                      background: order.status === 'Executed' ? '#22c55e' : '#e5e7eb',
                      color: order.status === 'Executed' ? '#fff' : '#9ca3af',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0.5em 1.2em',
                      fontWeight: 500,
                      cursor: order.status === 'Executed' ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyStocks;
