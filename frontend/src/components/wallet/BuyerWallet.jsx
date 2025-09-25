import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import './BuyerWallet.css';
import { FaWallet, FaShoppingCart, FaCheckCircle, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';

const BuyerWallet = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [buyCount, setBuyCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [updateAmount, setUpdateAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch portfolio and stats
  const fetchWalletData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get portfolio (assume only one per buyer)
      const userId = sessionStorage.getItem('user_id');
      const resPortfolio = await axiosInstance.get(`/api/portfolio/getAllByUserId`, {
        params: { user_id: userId }
      });
      const portfolioData = resPortfolio.data[0] || resPortfolio.data;
      setPortfolio(portfolioData);

      // Get buy/sold stats and profit
      const buyerId = portfolioData?.buyer_id;
      const resOrders = await axiosInstance.get(`/api/order/totalQuantity/${buyerId}`);
      console.log(resOrders)
      setBuyCount(resOrders.data.totalQuantity || 0);
      //setSoldCount(resOrders.data.soldCount || 0);
      setProfit(resOrders.data.totalProfit || 100);
    } catch (err) {
      //setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Update wallet balance
  const handleUpdate = async e => {
    e.preventDefault();
    if (!updateAmount || isNaN(updateAmount)) return;

    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (!portfolio) {
        // No portfolio, create one
        await axiosInstance.post('/api/portfolio/addPortfolio', {
          user_id: userId,
          virtual_balance: Number(updateAmount)
        });
      } else {
        console.log("Updating existing portfolio:", portfolio);

        if (updateAmount <= 0) {
          setError("Amount must be positive");
          setLoading(false);
          return;
        }
        // Portfolio exists, update
        await axiosInstance.put(`/api/portfolio/update/${portfolio._id}`, {
          user_id: userId,
          virtual_balance: Number(updateAmount) + Number(portfolio.virtual_balance)
        });
      }
      setUpdateAmount("");
      await fetchWalletData(); // refresh
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError("Failed to update balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-wallet-dashboard">
      <div className="wallet-tiles">
        <div className="wallet-tile">
          <div className="tile-icon"><FaWallet size={28} color="#2563eb" /></div>
          <div className="tile-label">Available Balance</div>
          <div className="tile-value">$ {portfolio?.virtual_balance ?? '--'}</div>
        </div>
        <div className="wallet-tile">
          <div className="tile-icon"><FaShoppingCart size={28} color="#2563eb" /></div>
          <div className="tile-label">Total Buy Stocks</div>
          <div className="tile-value">{buyCount}</div>
        </div>
        <div className="wallet-tile">
          <div className="tile-icon"><FaCheckCircle size={28} color="#2563eb" /></div>
          <div className="tile-label">Sold Stocks</div>
          <div className="tile-value">{soldCount}</div>
        </div>
        <div className="wallet-tile">
          <div className="tile-icon"><FaChartLine size={28} color="#2563eb" /></div>
          <div className="tile-label">Total Profit</div>
          <div className="tile-value">$ {profit}</div>
        </div>
      </div>
      <div className="update-wallet-form-wrapper">
        <form className="update-wallet-form" onSubmit={handleUpdate}>
          <h3><FaMoneyBillWave size={22} color="#048c31" style={{ marginRight: 8 }} />Update Wallet Balance</h3>
          <div className="wallet-form-row">
            <input
              type="number"
              placeholder="Enter new balance"
              value={updateAmount}
              onChange={e => setUpdateAmount(e.target.value)}
              min="0"
              className="update-input"
            />
            <button type="submit" className="update-btn" disabled={loading}>
              {loading
                ? (portfolio ? 'Updating...' : 'Adding...')
                : (portfolio ? <>Update</> : <>Add</>)}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default BuyerWallet;
