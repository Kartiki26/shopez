import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function loadReviews() {
    api.get(`/reviews/product/${id}`).then((res) => setReviews(res.data));
  }

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'));
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleAddToCart() {
    addToCart(product, Number(quantity));
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    try {
      await api.post('/reviews', { productId: id, rating: Number(rating), comment });
      setComment('');
      setRating(5);
      loadReviews();
      api.get(`/products/${id}`).then((res) => setProduct(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  }

  if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!product) return <div className="container py-4">Loading...</div>;

  const finalPrice = product.price - (product.price * product.discountPercent) / 100;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-5 mb-4">
          <img
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/500/400'}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-7">
          <h3>{product.name}</h3>
          <StarRating rating={product.avgRating} numReviews={product.numReviews} />
          <p className="text-muted mt-2">{product.category}</p>
          <p>{product.description}</p>

          <div className="mb-2">
            {product.discountPercent > 0 && (
              <span className="price-original">${product.price.toFixed(2)}</span>
            )}
            <span className="price-final fs-4">${finalPrice.toFixed(2)}</span>
            {product.discountPercent > 0 && (
              <span className="badge badge-discount ms-2">{product.discountPercent}% off</span>
            )}
          </div>

          <p className="text-muted">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="number"
                min="1"
                max={product.stock}
                className="form-control"
                style={{ width: '90px' }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button className="btn btn-shopez" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}

          {message && <div className="alert alert-success py-2">{message}</div>}
        </div>
      </div>

      <hr className="my-4" />

      <h5>Customer Reviews</h5>
      {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r._id} className="border-bottom py-2">
          <div className="d-flex justify-content-between">
            <strong>{r.userName}</strong>
            <StarRating rating={r.rating} />
          </div>
          <p className="mb-0">{r.comment}</p>
        </div>
      ))}

      {user ? (
        <form className="mt-4" onSubmit={handleSubmitReview}>
          <h6>Leave a review</h6>
          <div className="mb-2">
            <select
              className="form-select"
              style={{ maxWidth: '150px' }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button className="btn btn-shopez" type="submit">
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-muted mt-3">
          <a href="#" onClick={() => navigate('/login')}>
            Log in
          </a>{' '}
          to leave a review.
        </p>
      )}
    </div>
  );
}
