import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminService';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'BUYER' });
  const [newStock, setNewStock] = useState({ symbol: '', company_name: '', current_price: 0, quantity: 0, type: '', trader_id: '' });

  const loadAll = async () => {
    const [u, s] = await Promise.all([
      adminAPI.listUsers(),
      adminAPI.listStocks(),
    ]);
    setUsers(u.data || []);
    setStocks(s.data || []);
  };

  useEffect(() => { loadAll(); }, []);

  // -------- Users --------
  const handleCreateUser = async (e) => {
    e.preventDefault();
    await adminAPI.createUser(newUser);
    setNewUser({ name: '', email: '', password: '', role: 'BUYER' });
    loadAll();
  };

  const handleDeleteUser = async (id) => {
    await adminAPI.deleteUser(id);
    loadAll();
  };

  // -------- Stocks --------
  
  const handleDeleteStock = async (id) => {
    await adminAPI.deleteStock(id);
    loadAll();
  };

  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
      <h2 style={{ color: '#2563eb' }}>Admin Dashboard</h2>

      {/* ---------------- Users ---------------- */}
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2em', fontWeight: 600, color: '#2563eb' }}>Manage Users</h3>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left: Users Table */}
          <div style={{ flex: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f6ff', color: '#2563eb', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>{u.role}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteUser(u._id)} 
                        style={{ color: '#dc2626', border: '1px solid #dc2626', padding: '0.25rem 0.75rem', borderRadius: 4, background: 'white', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

       
          <div style={{
            flex: 1,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            minWidth: "300px"
          }}>
           <h3 style={{ marginBottom: '1rem', fontSize: '1.2em', fontWeight: 600, color: '#2563eb' }}>Create User</h3>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option>BUYER</option>
                <option>TRADER</option>
                <option>ADMIN</option>
              </select>
              <button type="submit" style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}>Create</button>
            </form>
          </div>
        </div>
      </section>

      
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2em', fontWeight: 600, color: '#2563eb' }}>Manage Stocks</h3>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
          <div style={{ flex: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f6ff', color: '#2563eb', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Symbol</th>
                  <th style={{ padding: '0.75rem' }}>Company</th>
                  <th style={{ padding: '0.75rem' }}>Price</th>
                  <th style={{ padding: '0.75rem' }}>Quantity</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Trader</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{s.symbol}</td>
                    <td style={{ padding: '0.75rem' }}>{s.company_name}</td>
                    <td style={{ padding: '0.75rem' }}>${s.current_price}</td>
                    <td style={{ padding: '0.75rem' }}>{s.quantity}</td>
                    <td style={{ padding: '0.75rem' }}>{s.type}</td>
                    <td style={{ padding: '0.75rem' }}>{s.trader_id}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteStock(s._id)} 
                        style={{ color: '#dc2626', border: '1px solid #dc2626', padding: '0.25rem 0.75rem', borderRadius: 4, background: 'white', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DashboardAdmin;
