import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import ViewStock from './pages/MarketView';
import TraderDashboard from './pages/trader_dashboard/TraderDashboard';
import Stock from './pages/trader_dashboard/TraderStock';
import Transaction from './pages/trader_dashboard/TraderTransactions';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/marketview" element={<ViewStock />} />
        <Route path="/trader-dashboard" element={<TraderDashboard />} />
        <Route path="/trader-dashboard/stock" element={<Stock />} />
        <Route path="/trader-dashboard/transactions" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;


