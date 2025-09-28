import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { FaShoppingCart } from 'react-icons/fa';

const ViewStocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buyModal, setBuyModal] = useState({ open: false, stock: null });
    const [shareCount, setShareCount] = useState('');
    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/api/stocks/getAllStocks');
                setStocks(res.data);
            } catch (err) {
                setStocks([]);
            } finally {
                setLoading(false);
            }
        };
        const fetchWallet = async () => {
            const userId = sessionStorage.getItem('user_id');
            if (!userId) return;
            try {
                const res = await axiosInstance.get(`/api/portfolio/getAllByUserId`, {
                    params: { user_id: userId }
                });
                setWallet(res.data[0] || res.data);
            } catch { }
        };
        fetchStocks();
        fetchWallet();
    }, []);

    const openBuyModal = stock => {
        setBuyModal({ open: true, stock });
        setShareCount('');
        setError('');
        setSuccess('');
    };
    const closeBuyModal = () => {
        setBuyModal({ open: false, stock: null });
        setShareCount('');
        setError('');
        setSuccess('');
    };

    const handleBuy = async () => {
        setError('');
        setSuccess('');
        const count = Number(shareCount);
        if (!count || count < 1) {
            setError('Enter a valid share count');
            return;
        }
        if (count > buyModal.stock.quantity) {
            setError('Not enough shares available');
            return;
        }
        const totalCost = count * buyModal.stock.current_price;
        if (!wallet || wallet.virtual_balance < totalCost) {
            setError('Insufficient wallet balance');
            return;
        }
        try {
            // Create order (pending)
            const userId = sessionStorage.getItem('user_id');
            const orderRes = await axiosInstance.post('/api/order/create', {
                buyer_id: userId,
                portfolio_id: wallet._id,
                stock_id: buyModal.stock._id,
                order_type: 'BUY',
                quantity: count,
                price: buyModal.stock.current_price,
                status: 'Pending',
            });
            // Add transaction
            await axiosInstance.post('/api/transaction', {
                order_id: orderRes.data._id,
                buyer_id: userId,
                portfolio_id: wallet._id,
                stock_id: buyModal.stock._id,
                transaction_type: 'BUY',
                quantity: count,
                price: buyModal.stock.current_price,
            });
            setSuccess('Order placed successfully!');
            setTimeout(() => {
                closeBuyModal();
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ color: '#2563eb', marginBottom: '1.2em' }}>Available Stocks</h2>
            {loading ? <div>Loading...</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px #e5e7eb' }}>
                    <thead>
                        <tr style={{ background: '#f0f6ff', color: '#rgb(55, 65, 81)' }}>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Logo</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Symbol</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Company</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Type</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Price</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Quantity</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Trader</th>
                            <th style={{ textAlign: 'center', padding: '0.7em' }}>Buy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map(stock => (
                            <tr key={stock._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.logo ? <img src={"http://localhost:5001" + stock.logo} alt="logo" style={{ width: 32, height: 32, borderRadius: 6 }} /> : '-'}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.symbol}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.company_name}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.type}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>$ {stock.current_price}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.quantity}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>{stock.trader_id?.name || '-'}</td>
                                <td style={{ textAlign: 'center', padding: '0.7em' }}>
                                    <button onClick={() => openBuyModal(stock)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <FaShoppingCart size={22} color="#2563eb" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Buy Modal */}
            {buyModal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #2563eb22', padding: '2rem 2.5rem', minWidth: 320 }}>
                        <h3 style={{ color: '#2563eb', marginBottom: '1em' }}>Buy Shares: {buyModal.stock.symbol}</h3>
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ marginRight: 8 }}>Shares to buy:</label>
                            <input
                                type="number"
                                min={1}
                                max={buyModal.stock.quantity}
                                value={shareCount}
                                onChange={e => setShareCount(e.target.value)}
                                style={{ width: 80, padding: '0.4em', borderRadius: 6, border: '1px solid #d1d5db' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1em', color: '#374151', fontSize: '0.98em' }}>
                            <span>Available: {buyModal.stock.quantity} | Price: ${buyModal.stock.current_price} | Wallet: ${wallet?.virtual_balance ?? '--'}</span>
                        </div>
                        {error && <div style={{ color: '#dc2626', marginBottom: '0.7em' }}>{error}</div>}
                        {success && <div style={{ color: '#059669', marginBottom: '0.7em' }}>{success}</div>}
                        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
                            <button onClick={handleBuy} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7em 2em', fontWeight: 500, cursor: 'pointer' }}>Buy</button>
                            <button onClick={closeBuyModal} style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '0.7em 2em', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewStocks;
