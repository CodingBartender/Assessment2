import React, { useState, useEffect } from 'react';
import { FaBuilding, FaChartLine, FaMoneyBill, FaHashtag, FaBoxes } from 'react-icons/fa';
import axiosInstance from '../../axiosConfig';
import './AddStockForm.css';
import { useAuth } from '../../context/AuthContext';

// Factory Pattern for Stock Creation
class Stock {
  constructor({ symbol, logo, company_name, current_price, quantity, type }) {
    this.symbol = symbol;
    this.logo = logo;
    this.company_name = company_name;
    this.current_price = current_price;
    this.quantity = quantity;
    this.type = type;
  }
}

class EquityStock extends Stock {
  constructor(props) {
    super({ ...props, type: 'equity' });
  }
}

class BondStock extends Stock {
  constructor(props) {
    super({ ...props, type: 'bond' });
  }
}

const StockFactory = {
  createStock: (type, props) => {
    if (type === 'equity') return new EquityStock(props);
    if (type === 'bond') return new BondStock(props);
    return new Stock(props);
  },
};

const initialState = {
  symbol: '',
  logo: '',
  company_name: '',
  current_price: '',
  quantity: '',
  type: 'equity',
};


const AddStockForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setForm({
        symbol: initialData.symbol || '',
        logo: initialData.logo || '',
        company_name: initialData.company_name || '',
        current_price: initialData.current_price || '',
        quantity: initialData.quantity || '',
        type: initialData.type || 'equity',
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.symbol.trim()) errs.symbol = 'Symbol is required.';
    if (!form.company_name.trim()) errs.company_name = 'Company name is required.';
    if (!form.current_price || isNaN(form.current_price) || Number(form.current_price) <= 0)
      errs.current_price = 'Valid price required.';
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0)
      errs.quantity = 'Valid quantity required.';
    if (!form.type) errs.type = 'Type is required.';
    return errs;
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setLogoFile(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(e => ({ ...e, [name]: undefined }));
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      let res;
      const traderId = sessionStorage.getItem('user_id');
      const formData = new FormData();
      formData.append('symbol', form.symbol);
      formData.append('company_name', form.company_name);
      formData.append('current_price', form.current_price);
      formData.append('quantity', form.quantity);
      formData.append('type', form.type);
      formData.append('trader_id', traderId);
      if (logoFile) formData.append('logo', logoFile);
      if (initialData && initialData._id) {
        // Update
        res = await axiosInstance.put(`/api/stocks/updateStock/${initialData._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Add
        res = await axiosInstance.post('/api/stocks/addStock', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setForm(initialState);
      setLogoFile(null);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setApiError(
        err.response?.data?.error || err.message || 'Failed to save stock'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-stock-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Stock' : 'Add New Stock'}</h2>
      <div className="form-group">
        <label><FaHashtag /> Symbol</label>
        <input name="symbol" value={form.symbol} onChange={handleChange} />
        {errors.symbol && <span className="error">{errors.symbol}</span>}
      </div>
      <div className="form-group">
        <label><FaBuilding /> Company Name</label>
        <input name="company_name" value={form.company_name} onChange={handleChange} />
        {errors.company_name && <span className="error">{errors.company_name}</span>}
      </div>
      <div className="form-group">
        <label><FaChartLine /> Current Price</label>
        <input name="current_price" value={form.current_price} onChange={handleChange} type="number" min="0" step="0.01" />
        {errors.current_price && <span className="error">{errors.current_price}</span>}
      </div>
      <div className="form-group">
        <label><FaBoxes /> Quantity</label>
        <input name="quantity" value={form.quantity} onChange={handleChange} type="number" min="0" />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </div>
      <div className="form-group">
        <label><FaMoneyBill /> Logo</label>
        <input name="logo" type="file" accept="image/*" onChange={handleChange} />
        {form.logo && typeof form.logo === 'string' && (
          <img src={form.logo} alt="logo preview" style={{ maxWidth: 80, marginTop: 8 }} />
        )}
      </div>
      <div className="form-group">
        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="equity">Equity</option>
          <option value="bond">Bond</option>
        </select>
        {errors.type && <span className="error">{errors.type}</span>}
      </div>
      {apiError && <div className="error api-error">{apiError}</div>}
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Stock' : 'Add Stock')}
      </button>
    </form>
  );
};

export default AddStockForm;
