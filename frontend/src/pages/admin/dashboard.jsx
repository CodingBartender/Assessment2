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

  // function to manage users
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

  // function to manange stock
  const handleDeleteStock = async (id) => {
    await adminAPI.deleteStock(id);
    loadAll();
  };

  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '2.5rem' }}>
  <h1 style={{ 
    color: '#2563eb', 
    marginBottom: '1rem',
    fontSize: '2rem',           
    fontWeight: 700,            
    paddingBottom: '0.5rem'     
  }}>
    Admin Dashboard
  </h1>


      {/* user section */}
      <section style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #0c0c0cff',
        borderTop: '6px solid #2563eb'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1.2em',
          fontWeight: 600,
          color: '#111827'
        }}>Manage Users</h3>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* user table */}
          <div style={{ flex: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2563eb', color: '#fff' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    style={{
                      background: index % 2 === 0 ? '#fff' : '#f9fafb',
                      borderBottom: '1px solid #d2d2d6ff',
                      cursor: 'pointer'
                    }}
                  >
                    <td style={{ padding: '0.75rem' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>{u.role}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{
                          color: '#eceaeaff',
                          border: '1px solid #dc2626',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 4,
                          background: '#c11616ff',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* register new user form */}
          <div style={{
            flex: 1,
            background: "#f9f9f6ff",
            border: "1px solid #161718ff",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "2 4px 6px rgba(0,0,0,0.05)",
            minWidth: "300px"
          }}>
             <h3 style={{
          marginBottom: '1rem',
          fontSize: '1.2em',
          fontWeight: 600,
          color: '#111827'
        }}>Create User</h3>
           <form 
  onSubmit={handleCreateUser} 
  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
>
  
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "0.3rem", fontWeight: 500, color: "#374151" }}>Name</label>
    <input 
      type="text"
      placeholder="Enter full name"
      value={newUser.name} 
      onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
      autoComplete="off"
      style={{
        padding: "0.6rem",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        outline: "none",
        fontSize: "0.95rem",
      }}
      onFocus={e => e.target.style.border = "1px solid #2563eb"}
      onBlur={e => e.target.style.border = "1px solid #d1d5db"}
    />
  </div>

 
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "0.3rem", fontWeight: 500, color: "#374151" }}>Email</label>
    <input 
      type="email"
      placeholder="Enter email"
      value={newUser.email} 
      onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
      autoComplete="off"
      style={{
        padding: "0.6rem",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        outline: "none",
        fontSize: "0.95rem"
      }}
      onFocus={e => e.target.style.border = "1px solid #2563eb"}
      onBlur={e => e.target.style.border = "1px solid #d1d5db"}
    />
  </div>

 
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "0.3rem", fontWeight: 500, color: "#374151" }}>Password</label>
    <input 
      type="password"
      placeholder="Enter password"
      value={newUser.password} 
      onChange={e => setNewUser({ ...newUser, password: e.target.value })} 
      autoComplete="new-password"
      style={{
        padding: "0.6rem",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        outline: "none",
        fontSize: "0.95rem"
      }}
      onFocus={e => e.target.style.border = "1px solid #2563eb"}
      onBlur={e => e.target.style.border = "1px solid #d1d5db"}
    />
  </div>

 
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "0.3rem", fontWeight: 500, color: "#374151" }}>Role</label>
    <select 
      value={newUser.role} 
      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
      style={{
        padding: "0.6rem",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        fontSize: "0.95rem",
        background: "#fff"
      }}
    >
      <option>BUYER</option>
      <option>TRADER</option>
      <option>ADMIN</option>
    </select>
  </div>

  
  <button 
    type="submit" 
    style={{ 
      padding: "0.7rem", 
      background: "#0e8f27", 
      color: "#fff", 
      border: "none", 
      borderRadius: 6, 
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.3s"
    }}
    onMouseEnter={e => e.target.style.background = "#0b6d1f"}
    onMouseLeave={e => e.target.style.background = "#0e8f27"}
  >
    Create User
  </button>
</form>

          </div>
        </div>
      </section>

      {/*  Stocks section */}
      <section style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #111112ff',
        borderTop: '6px solid #2563eb'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1.2em',
          fontWeight: 600,
          color: '#111827'
        }}>Manage Stocks</h3>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/*  Stocks Table */}
          <div style={{ flex: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2563eb', color: '#fff' }}>
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
                {stocks.map((s, index) => (
                  <tr
                    key={s._id}
                    style={{
                      background: index % 2 === 0 ? '#fff' : '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer'
                    }}
                  >
                    <td style={{ padding: '0.75rem' }}>{s.symbol}</td>
                    <td style={{ padding: '0.75rem' }}>{s.company_name}</td>
                    <td style={{ padding: '0.75rem' }}>${s.current_price}</td>
                    <td style={{ padding: '0.75rem' }}>{s.quantity}</td>
                    <td style={{ padding: '0.75rem' }}>{s.type}</td>
                    <td style={{ padding: '0.75rem' }}>{s.trader_id}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteStock(s._id)}
                        style={{
                          color: '#dc2626',
                          border: '1px solid #dc2626',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 4,
                          background: '#fff',
                          cursor: 'pointer'
                        }}
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
