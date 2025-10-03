
import React, { useEffect, useState } from 'react';
import AddStockForm from '../../components/stock/AddStockForm';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../axiosConfig';
import './TraderStock.css';

const TraderStock = () => {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      const res = await axiosInstance.get('/api/stocks/getAllStocks');
      setStocks(res.data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Add or update stock
  const handleFormSuccess = async (data) => {
    setEditingStock(null);
    await fetchStocks();
  };

  // Edit stock
  const handleEdit = (stock) => {
    setEditingStock(stock);
  };

  // Delete stock
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/stocks/delete/${id}`);
      setShowDeleteId(null);
      await fetchStocks();
    } catch (err) {
      // handle error
    }
  };


  return (
    <div className="trader-stock-page">
      <div className="stock-chart">
        <h2>Stocks</h2>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Symbol</th>
              <th>Company Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock._id}>
                <td>
                  {stock.logo ? (
                    <img src={"http://localhost:5001"+stock.logo} alt={stock.symbol} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  ) : (
                    <span className="stock-logo-placeholder">{stock.symbol[0]}</span>
                  )}
                </td>
                <td>{stock.symbol}</td>
                <td>{stock.company_name}</td>
                <td>{stock.type}</td>
                <td>${stock.current_price}</td>
                <td>{stock.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(stock)}><FaEdit /></button>
                  <button className="delete-btn" onClick={() => setShowDeleteId(stock._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="add-stock-form-wrapper">
        <AddStockForm
          key={editingStock ? editingStock._id : 'new'}
          onSuccess={handleFormSuccess}
          initialData={editingStock}
        />
      </div>
      {/* Delete confirmation popup */}
      {showDeleteId && (
        <div className="delete-popup">
          <div className="delete-popup-content">
            <p>Are you sure you want to delete this stock?</p>
            <button onClick={() => handleDelete(showDeleteId)} className="confirm-btn">Delete</button>
            <button onClick={() => setShowDeleteId(null)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderStock;
