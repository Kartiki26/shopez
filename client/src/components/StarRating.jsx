export default function StarRating({ rating = 0, numReviews }) {
  const rounded = Math.round(rating);
  const stars = [1, 2, 3, 4, 5].map((n) => (
    <span key={n} className="star">
      {n <= rounded ? '★' : '☆'}
    </span>
  ));

  return (
    <span>
      {stars}
      {typeof numReviews === 'number' && (
        <span className="text-muted ms-1" style={{ fontSize: '0.85rem' }}>
          ({numReviews})
        </span>
      )}
    </span>
  );
}
