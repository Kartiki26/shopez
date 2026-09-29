import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setStats(res.data));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Dashboard</h3>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Link to="/admin/products" className="btn btn-shopez w-100">
            Manage Products
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/admin/orders" className="btn btn-shopez w-100">
            Manage Orders
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/admin/coupons" className="btn btn-shopez w-100">
            Manage Coupons
          </Link>
        </div>
      </div>

      {!stats && <p>Loading analytics...</p>}

      {stats && (
        <>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card text-center p-3">
                <div className="text-muted small">Total Sales</div>
                <div className="fs-3 fw-bold">${stats.totalSales.toFixed(2)}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center p-3">
                <div className="text-muted small">Total Orders</div>
                <div className="fs-3 fw-bold">{stats.totalOrders}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center p-3">
                <div className="text-muted small">Total Products</div>
                <div className="fs-3 fw-bold">{stats.totalProducts}</div>
              </div>
            </div>
          </div>

          <h5>Top Selling Products</h5>
          {stats.topProducts.length === 0 && <p className="text-muted">No sales yet.</p>}
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.quantitySold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
