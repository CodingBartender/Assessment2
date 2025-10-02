import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminService';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
 

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'BUYER' });
  const [newStock, setNewStock] = useState({ symbol: '', company_name: '', current_price: 0, quantity: 0 });

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
  const handleCreateStock = async (e) => {
    e.preventDefault();
    await adminAPI.createStock({ ...newStock, current_price: Number(newStock.current_price), quantity: Number(newStock.quantity) });
    setNewStock({ symbol: '', company_name: '', current_price: 0, quantity: 0 });
    loadAll();
  };

  const handleDeleteStock = async (id) => {
    await adminAPI.deleteStock(id);
    loadAll();
  };

  
  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
      <h2 style={{ color: '#2563eb' }}>Admin Dashboard</h2>

      {/* ---------------- Users ---------------- */}
     {/* ---------------- Users ---------------- */}
<section style={{ background: '#fff', padding: '1.5rem', borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb' }}>
  <h3 style={{ marginBottom: '1rem', fontSize: '1.2em', fontWeight: 600, color: '#2563eb' }}>Manage Users</h3>

  {/* Create User Form */}
  <form 
    onSubmit={handleCreateUser} 
    style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}
  >
    <input placeholder="Name" value={newUser.name}
      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
      style={{ flex: 1, padding: '0.5rem' }} />
    <input placeholder="Email" value={newUser.email}
      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
      style={{ flex: 1, padding: '0.5rem' }} />
    <input placeholder="Password" type="password" value={newUser.password}
      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
      style={{ flex: 1, padding: '0.5rem' }} />
    <select value={newUser.role}
      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
      style={{ padding: '0.5rem' }}>
      <option>BUYER</option>
      <option>TRADER</option>
      <option>ADMIN</option>
    </select>
    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>
      Create User
    </button>
  </form>

  {/* Users Table */}
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
</section>


      {/* ---------------- Stocks ---------------- */}
      <section style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb' }}>
        <h3>Stocks</h3>
        <form onSubmit={handleCreateStock} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          <input placeholder="Symbol" value={newStock.symbol} onChange={e => setNewStock({ ...newStock, symbol: e.target.value })}/>
          <input placeholder="Company" value={newStock.company_name} onChange={e => setNewStock({ ...newStock, company_name: e.target.value })}/>
          <input placeholder="Price" type="number" value={newStock.current_price} onChange={e => setNewStock({ ...newStock, current_price: e.target.value })}/>
          <input placeholder="Qty" type="number" value={newStock.quantity} onChange={e => setNewStock({ ...newStock, quantity: e.target.value })}/>
          <button type="submit" style={{ gridColumn: 'span 4' }}>Add Stock</button>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Symbol</th><th>Company</th><th>Price</th><th>Qty</th><th></th></tr></thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s._id}>
                <td>{s.symbol}</td><td>{s.company_name}</td><td>{s.current_price}</td><td>{s.quantity}</td>
                <td><button onClick={() => handleDeleteStock(s._id)} style={{ color: '#dc2626' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

  
    </div>
  );
};

export default DashboardAdmin;
