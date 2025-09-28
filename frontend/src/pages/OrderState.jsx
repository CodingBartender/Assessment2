import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import OrderStateForm from '../components/OrderStateForm';
import OrderStateList from '../components/OrderStateList';
import { useAuth } from '../context/AuthContext';

const OrderState = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/orderstate', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(response.data);
      } catch (error) {
        alert('Failed to fetch orders.');
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <OrderStateForm
        orders={orders}
        setOrders={setOrders}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
      />
      <OrderStateList
        orders={orders}
        setOrders={setOrders}
        setEditingOrder={setEditingOrder}
      />
    </div>
  );
};

export default OrderState;
