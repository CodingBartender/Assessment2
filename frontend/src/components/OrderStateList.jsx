import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderStateList = ({ orders, setOrders }) => {
  const { user } = useAuth();

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/orderstate/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(orders.map((o) => (o._id === orderId ? response.data : o)));
    } catch (error) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{order.stockName}</h2>
          <p>Shares: {order.shares}</p>
          <p>Unit Price: {order.unitPrice}</p>
          <p>Type: {order.type}</p>
          <p>Status: {order.status}</p>
          {order.executedAt && (
            <p>Executed At: {new Date(order.executedAt).toLocaleString()}</p>
          )}
          <div className="mt-2">
            <button
              onClick={() => updateStatus(order._id, 'Pending')}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Mark Pending
            </button>
            <button
              onClick={() => updateStatus(order._id, 'Executed')}
              className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Execute
            </button>
            <button
              onClick={() => updateStatus(order._id, 'Cancelled')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStateList;
