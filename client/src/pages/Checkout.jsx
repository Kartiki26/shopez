import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const total = subtotal - discountAmount;

  async function handleApplyCoupon() {
    setCouponError('');
    setAppliedCoupon(null);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    }
  }

  async function handlePlaceOrder() {
    setPlacingOrder(true);
    setOrderError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (items.length === 0) {
    return <div className="container py-5">Your cart is empty.</div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Checkout</h3>

      <div className="card mb-4">
        <div className="card-body">
          <h6>Order Summary</h6>
          {items.map((item) => {
            const effective = item.price - (item.price * item.discountPercent) / 100;
            return (
              <div key={item.productId} className="d-flex justify-content-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(effective * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Coupon code</label>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="e.g. WELCOME10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={handleApplyCoupon} type="button">
            Apply
          </button>
        </div>
        {couponError && <div className="text-danger small mt-1">{couponError}</div>}
        {appliedCoupon && (
          <div className="text-success small mt-1">
            Coupon "{appliedCoupon.code}" applied: {appliedCoupon.discountPercent}% off
          </div>
        )}
      </div>

      <div className="mb-2 d-flex justify-content-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="mb-2 d-flex justify-content-between text-success">
          <span>Discount</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="mb-4 d-flex justify-content-between fs-5">
        <strong>Total</strong>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <div className="alert alert-info small">
        This is a mock checkout for demo purposes — no real payment is processed. Clicking "Place
        Order" simulates a successful payment.
      </div>

      {orderError && <div className="alert alert-danger">{orderError}</div>}

      <button className="btn btn-shopez w-100" onClick={handlePlaceOrder} disabled={placingOrder}>
        {placingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
