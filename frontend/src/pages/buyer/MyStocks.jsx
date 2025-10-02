import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { OrderStatusChip } from '../../components/order/OrderStatusChip';
import { FaTrashAlt } from 'react-icons/fa';

const MyStocks = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, order: null });
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        const userId = sessionStorage.getItem('user_id');
        if (!userId) return;
        try {
            const res = await axiosInstance.get(`/api/order`, {
                headers: { 'user_id': userId }
            });
            setOrders(res.data);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const openDeleteDialog = order => {
        setDeleteDialog({ open: true, order });
        setError('');
    };
    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, order: null });
        setError('');
    };

    const handleDelete = async () => {
        setActionLoading(true);
        setError('');
        const userId = sessionStorage.getItem('user_id');
        const order = deleteDialog.order;
        try {
            // Delete order
            await axiosInstance.delete(`/api/order/delete/${order._id}`, {
                data: { user_id: userId }
            });
            // Update wallet (add back money)
            const portfolioId = order.portfolio_id._id;

            await axiosInstance.put(`/api/portfolio/${portfolioId}`, {
                user_id: userId,
                virtual_balance: (order.price * order.quantity) + order.portfolio_id.virtual_balance, // Add back
            });
            // Add transaction (REMOVED)
            await axiosInstance.post('/api/transaction', {
                order_id: order._id,
                buyer_id: userId,
                portfolio_id: order.portfolio_id,
                stock_id: order.stock_id?._id,
                transaction_type: 'REMOVED',
                quantity: order.quantity,
                price: order.price,
            });
            closeDeleteDialog();
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete order');
        } finally {
            setActionLoading(false);
        }
    };

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
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Remove</th>
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
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>
                                    <button
                                        onClick={() => openDeleteDialog(order)}
                                        style={{
                                            background: '#fff',
                                            border: '1.5px solid #dc2626',
                                            color: '#dc2626',
                                            borderRadius: 6,
                                            padding: '0.5em 0.9em',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4em',
                                        }}
                                    >
                                        <FaTrashAlt size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Delete Dialog */}
            {deleteDialog.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #dc2626', padding: '2rem 2.5rem', minWidth: 320, border: '2px solid #dc2626' }}>
                        <h3 style={{ color: '#dc2626', marginBottom: '1em' }}>Remove Stock</h3>
                        <div style={{ marginBottom: '1em', color: '#374151', fontSize: '0.98em' }}>
                            Are you sure you want to delete this stock order? This will refund your wallet and update your transaction history.
                        </div>
                        {error && <div style={{ color: '#dc2626', marginBottom: '0.7em' }}>{error}</div>}
                        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
                            <button onClick={handleDelete} disabled={actionLoading} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7em 2em', fontWeight: 500, cursor: 'pointer' }}>{actionLoading ? 'Removing...' : 'Yes, Remove'}</button>
                            <button onClick={closeDeleteDialog} disabled={actionLoading} style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '0.7em 2em', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyStocks;
