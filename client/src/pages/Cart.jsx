import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Your cart is empty</h4>
        <Link to="/" className="btn btn-shopez mt-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Your Cart</h3>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const effective = item.price - (item.price * item.discountPercent) / 100;
            return (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>${effective.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    style={{ width: '80px' }}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  />
                </td>
                <td>${(effective * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <div style={{ minWidth: '250px' }}>
          <div className="d-flex justify-content-between fs-5 mb-3">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <button className="btn btn-shopez w-100" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
