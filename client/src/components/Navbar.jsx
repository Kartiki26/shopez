import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#17242e' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          ShopEZ
        </Link>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart {cartCount > 0 && <span className="badge bg-light text-dark">{cartCount}</span>}
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-orders">
                  My Orders
                </Link>
              </li>
            )}

            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="nav-item text-light small">Hi, {user.name}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-shopez btn-sm" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
