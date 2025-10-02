import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import ViewStock from './pages/buyer/ViewStocks';
import TraderDashboard from './pages/trader_dashboard/TraderDashboard';
import Stock from './pages/trader_dashboard/TraderStock';
import TrradeHistory from './pages/trader_dashboard/TraderTransactions';
import Portfolio from './pages/buyer/Portfolio';
import Transaction from './pages/buyer/Transaction';
import MarketView from './pages/MarketView';
import DashboardAdmin from './pages/admin/dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/buyer/ViewStocks" element={<ViewStock />} />
        <Route path="/MarketView" element={<MarketView />} />
        <Route path="/trader-dashboard" element={<TraderDashboard />} />
        <Route path="/trader-dashboard/stock" element={<Stock />} />
        <Route path="/trader-dashboard/transactions" element={<TrradeHistory />} />
        <Route path="/buyer/portfolio" element={<Portfolio />} />
        <Route path="/buyer/transactions" element={<Transaction />} />
        <Route path="/admin-dashboard" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;


