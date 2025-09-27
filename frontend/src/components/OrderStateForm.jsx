import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderStateForm = ({ orders, setOrders, editingOrder, setEditingOrder }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    stockName: '',
    shares: '',
    unitPrice: '',
    type: 'Buy',
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        stockName: editingOrder.stockName,
        shares: editingOrder.shares,
        unitPrice: editingOrder.unitPrice,
        type: editingOrder.type,
      });
    } else {
      setFormData({ stockName: '', shares: '', unitPrice: '', type: 'Buy' });
    }
  }, [editingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/orderstate', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders([...orders, response.data]);
      setFormData({ stockName: '', shares: '', unitPrice: '', type: 'Buy' });
      setEditingOrder(null);
    } catch (error) {
      alert('Failed to place order.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">Place New Order</h1>
      <input
        type="text"
        placeholder="Stock Name (e.g., AAPL)"
        value={formData.stockName}
        onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Shares"
        value={formData.shares}
        onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Unit Price"
        value={formData.unitPrice}
        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Confirm Order
      </button>
    </form>
  );
};

export default OrderStateForm;
