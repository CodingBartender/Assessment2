import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const TraderDashboardNavbar = () => {
  const { user } = useAuth();
  return (
    <nav className="trader-navbar">
      <div className="nav-left">
        <Link to="stock" className="nav-link">Stock</Link>
        <Link to="transactions" className="nav-link">Transactions</Link>
      </div>
      <div className="nav-right">
        <span className="user-name">{user?.username || 'Trader'}</span>
        <span className="avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="avatar-img" />
          ) : (
            <FaUserCircle size={32} color="#2563eb" />
          )}
        </span>
      </div>
    </nav>
  );
};

const TraderDashboard = () => {
  return (
    <div>
    
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TraderDashboard;
