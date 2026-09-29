import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  stock: '',
  discountPercent: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  function loadProducts() {
    api.get('/products').then((res) => setProducts(res.data));
  }

  useEffect(loadProducts, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      discountPercent: Number(form.discountPercent) || 0,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      discountPercent: product.discountPercent,
    });
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${productId}`);
    loadProducts();
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Manage Products</h3>

      <form className="card p-3 mb-4" onSubmit={handleSubmit}>
        <h6>{editingId ? 'Edit Product' : 'Add New Product'}</h6>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12">
            <textarea
              className="form-control"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="discountPercent"
              type="number"
              placeholder="Discount %"
              value={form.discountPercent}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-shopez flex-grow-1" type="submit">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.discountPercent}%</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
