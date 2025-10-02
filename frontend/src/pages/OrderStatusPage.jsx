import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import OrderStatusActions from '../components/order/OrderStatus';

const MyOrdersWithActions = () => {
  const [orders, setOrders] = useState([]);
  const userId = sessionStorage.getItem("user_id");

  const fetchOrders = async () => {
    const res = await axiosInstance.get(`/api/order/getOrdersByUserId/${userId}`);
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders (with Actions)</h2>
      <table>
        <thead>
          <tr><th>Stock</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.stock_id?.symbol}</td>
              <td><OrderStatusActions order={o} onUpdated={fetchOrders} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MyOrdersWithActions;
