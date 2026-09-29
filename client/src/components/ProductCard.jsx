import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = product.price - (product.price * product.discountPercent) / 100;

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 product-card shadow-sm">
        <img
          src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/300'}
          className="card-img-top"
          alt={product.name}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-1">{product.name}</h6>
          <div className="mb-2">
            <StarRating rating={product.avgRating} numReviews={product.numReviews} />
          </div>
          <div className="mb-2">
            {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
            <span className="price-final">${finalPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="badge badge-discount ms-2">{product.discountPercent}% off</span>
            )}
          </div>
          <Link to={`/products/${product._id}`} className="btn btn-shopez btn-sm mt-auto">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
