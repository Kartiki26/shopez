import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [error, setError] = useState('');

  function loadCoupons() {
    api.get('/coupons').then((res) => setCoupons(res.data));
  }

  useEffect(loadCoupons, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/coupons', { code, discountPercent: Number(discountPercent) });
      setCode('');
      setDiscountPercent('');
      loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  }

  async function toggleActive(coupon) {
    await api.put(`/coupons/${coupon._id}`, { active: !coupon.active });
    loadCoupons();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    loadCoupons();
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Manage Coupons</h3>

      <form className="card p-3 mb-4" onSubmit={handleSubmit}>
        <h6>Create New Coupon</h6>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Coupon Code (e.g. SAVE20)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              type="number"
              min="1"
              max="100"
              placeholder="Discount %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-shopez w-100" type="submit">
              Create Coupon
            </button>
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>{c.code}</td>
              <td>{c.discountPercent}%</td>
              <td>
                <span className={`badge ${c.active ? 'bg-success' : 'bg-secondary'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => toggleActive(c)}
                >
                  {c.active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {coupons.length === 0 && <p className="text-muted">No coupons created yet.</p>}
    </div>
  );
}
