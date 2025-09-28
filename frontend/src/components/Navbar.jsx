import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../images/stock_logo_final.png';  

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Stock Market Simulation</Link>
      {/*<p> <img src ={logo} alt = "Logo" width = "100" height = "100" className = "" /> </p> */}
      <div className="flex items-center">
        {user ? (
          <>
            <Link to="/tasks" className="font-bold mr-4">Stocks</Link>
            <Link to="/marketview" className="font-bold mr-4">Market View</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <Link to="/orderstate" className="font-bold mr-4">OrderState</Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="bg-red-500 px-4 py-2 rounded hover:bg-green-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
