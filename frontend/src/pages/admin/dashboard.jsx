import { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";

const DashboardAdmin = () => {
  
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       

        // Fetch all stocks
        const stocksRes = await axiosInstance.get("/api/stocks/getAllStocks");
        setStocks(stocksRes.data);
      } catch (err) {
        console.error("Error loading admin dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

     
      {/* Stocks Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Stocks</h2>
        {stocks.length === 0 ? (
          <p className="text-gray-500">No stocks available</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Symbol</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id} className="text-center">
                  <td className="p-2 border">{stock.symbol}</td>
                  <td className="p-2 border">{stock.company_name}</td>
                  <td className="p-2 border">${stock.current_price}</td>
                  <td className="p-2 border">{stock.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DashboardAdmin;
