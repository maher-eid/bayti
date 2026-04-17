import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      setError('Please fill all required fields');
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 🔥 SAVE ORDER TO SUPABASE
      const { error: insertError } = await supabase
        .from('orders')
        .insert([{
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          total: cartTotal,
          status: 'Pending',
          items: cart, // 🔥 full products saved
          date: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      // ✅ CLEAR CART AFTER SUCCESS
      clearCart();

      alert('Order placed successfully!');
      navigate('/');

    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ maxWidth: '1200px' }}>
      <h1 className="section-title">Checkout</h1>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          ❌ {error}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* FORM */}
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              rows="3"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {/* SUMMARY */}
        <div className="card">
          <h3>Order Summary</h3>

          {cart.map((item, i) => (
            <p key={i}>
              {item.title} × {item.quantity}
            </p>
          ))}

          <div className="cart-drawer-subtotal">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>

      </div>
    </section>
  );
}