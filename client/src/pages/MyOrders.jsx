import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">My Orders</h3>
      {orders.length === 0 && <p className="text-muted">You haven't placed any orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Order {order._id}</strong>
                <div className="text-muted small">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="badge bg-secondary text-uppercase align-self-start">
                {order.status}
              </span>
            </div>
            <ul className="list-unstyled mt-2 mb-2">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="fw-bold">Total: ${order.total.toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
