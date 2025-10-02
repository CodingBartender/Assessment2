import { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import TaskList from '../components/TaskList';

const MarketView = () => {
  const { user } = useAuth();

  // Owned Stock Overview 
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data);
    };
    fetchData();
  }, [user]);

  // TradingView
  const container = useRef();
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "symbol": "NASDAQ:AAPL",
      "chartOnly": false,
      "dateRange": "12M",
      "noTimeScale": false,
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "width": "100%",
      "autosize": true,
      "height": "100%"
    }`;
    container.current.appendChild(script);
  }, []);

  // FR5: Stock list & price feed (read-only)
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('symbol'); // symbol | price | qty | updated
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/api/stocks/getAllStocks');
        if (!mounted) return;
        const items = (Array.isArray(data) ? data : []).map((s) => ({
          _id: s._id,
          symbol: s.symbol,
          company_name: s.company_name,
          current_price: Number(s.current_price),
          quantity: Number(s.quantity),
          last_updated: s.last_updated,
          trader: s.trader_id
            ? { name: s.trader_id.name, email: s.trader_id.email }
            : null,
        }));
        setStocks(items);
      } catch (_) {
        if (mounted) setError('Failed to load stocks');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // FR6: Live updates (SSE, relative URL) ----------------
  useEffect(() => {
    // REACT_APP_API_URL handles routing.
    const base = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
    const src = `${base}/api/market/stream`; 
    const es = new EventSource(src);

    const mergeUpdate = (payload) => {
      setStocks((prev) => {
        const key = payload._id || payload.symbol;
        let found = false;
        const next = prev.map((p) => {
          const k = p._id || p.symbol;
          if (k === key) {
            found = true;
            return { ...p, ...payload };
          }
          return p;
        });
        return found ? next : next.concat(payload); //upsert in case a new stock arrives
      });
    };

    const onUpdated = (e) => {
      try {
        const data = JSON.parse(e.data);
        mergeUpdate(data);
      } catch {}
    };

    const onDeleted = (e) => {
      try {
        const data = JSON.parse(e.data);
        setStocks((prev) =>
          prev.filter((s) =>
            data._id ? s._id !== data._id : s.symbol !== data.symbol
          )
        );
      } catch {}
    };

    es.addEventListener('stock.updated', onUpdated);
    es.addEventListener('stock.deleted', onDeleted);
    es.onerror = () => {
      /* keep connection; browser auto-retries SSE */
    };

    return () => {
      es.removeEventListener('stock.updated', onUpdated);
      es.removeEventListener('stock.deleted', onDeleted);
      es.close();
    };
  }, []);

  // Derived list (filter/sort)
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = needle
      ? stocks.filter(
          (s) =>
            s.symbol?.toLowerCase().includes(needle) ||
            s.company_name?.toLowerCase().includes(needle)
        )
      : stocks.slice();

    switch (sort) {
      case 'price':
        base.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'qty':
        base.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'updated':
        base.sort(
          (a, b) =>
            new Date(a.last_updated || 0) - new Date(b.last_updated || 0)
        );
        break;
      default:
        base.sort((a, b) =>
          String(a.symbol || '').localeCompare(String(b.symbol || ''))
        );
    }
    return base;
  }, [stocks, q, sort]);

  // Orders drawer (read-only)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const openOrders = async (stock) => {
    setSelected(stock);
    setDrawerOpen(true);
    setOrders([]);
    setOrdersLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/stocks/${stock._id}/orders`);
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
    setOrders([]);
  };

  // UI 
  return (
    <div className="container mx-auto p-6">
      {/* Market overview */}
      <h1 className="text-2xl font-bold">Market Overview</h1>
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget" />
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/?exchange=NASDAQ"
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">AAPL chart by TradingView</span>
          </a>
        </div>
      </div>

      {/* FR5: Stock list & price feed */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Market Stock List</h2>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by symbol or company"
              className="border rounded px-3 py-2"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="symbol">Sort: Symbol</option>
              <option value="price">Sort: Price</option>
              <option value="qty">Sort: Quantity</option>
              <option value="updated">Sort: Last Updated</option>
            </select>
          </div>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s._id || s.symbol} className="border rounded p-4 shadow bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{s.symbol}</div>
                    <div className="text-sm opacity-70">{s.company_name}</div>
                    {s.trader?.name && (
                      <div className="text-xs opacity-60 mt-1">
                        Trader: {s.trader.name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl">
                      $ {Number(s.current_price).toFixed(2)}
                    </div>
                    <div className="text-xs opacity-70">Qty: {Number(s.quantity)}</div>
                  </div>
                </div>
                <div className="text-xs opacity-70 mt-2">
                  Updated:{' '}
                  {s.last_updated ? new Date(s.last_updated).toLocaleString() : '—'}
                </div>
                <div className="mt-3">
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                    onClick={() => openOrders(s)}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="opacity-60">No stocks found.</div>
            )}
          </div>
        )}
      </div>

      {/* Owned Stock Overview */}
      <h1 className="text-2xl font-bold mt-8">Owned Stock Overview</h1>
      <TaskList tasks={tasks} setTasks={setTasks} />

      {/* Orders Drawer (read-only) */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDrawer}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">
                Orders — {selected?.symbol}
              </h2>
              <button onClick={closeDrawer} className="px-3 py-1 border rounded">
                Close
              </button>
            </div>
            {ordersLoading ? (
              <div>Loading…</div>
            ) : orders.length ? (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o._id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {o.order_type} × {o.quantity}
                      </div>
                      <div>$ {(Number(o.price) || 0).toFixed(2)}</div>
                    </div>
                    <div className="text-xs opacity-70">
                      Status: {o.status} • Placed:{' '}
                      {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
                    </div>
                    {o.buyer_id?.name && (
                      <div className="text-xs opacity-70 mt-1">
                        Buyer: {o.buyer_id.name}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="opacity-60">No orders for this stock yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;