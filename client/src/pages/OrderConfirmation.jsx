import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Could not find that order'));
  }, [id]);

  if (error) return <div className="container py-5 alert alert-danger">{error}</div>;
  if (!order) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="text-center mb-4">
        <h2 className="text-success">Order Confirmed!</h2>
        <p className="text-muted">Order ID: {order._id}</p>
      </div>

      <div className="card">
        <div className="card-body">
          {order.items.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span>Discount ({order.couponCode})</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between fs-5">
            <strong>Total Paid</strong>
            <strong>${order.total.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/" className="btn btn-shopez">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
