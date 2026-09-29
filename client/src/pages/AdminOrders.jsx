import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUSES = ['placed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  function loadOrders() {
    api.get('/admin/orders').then((res) => setOrders(res.data));
  }

  useEffect(loadOrders, []);

  async function handleStatusChange(orderId, status) {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    loadOrders();
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Manage Orders</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="small">{order._id}</td>
              <td>
                {order.user?.name}
                <div className="text-muted small">{order.user?.email}</div>
              </td>
              <td>
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
              </td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-muted">No orders placed yet.</p>}
    </div>
  );
}
