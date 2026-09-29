import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    api
      .get('/products', { params })
      .then((res) => {
        setProducts(res.data);
        setError('');
      })
      .catch(() => setError('Could not load products. Is the backend server running?'))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Shop our catalog</h2>

      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No products match your search.</p>
      )}

      <div className="row">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
