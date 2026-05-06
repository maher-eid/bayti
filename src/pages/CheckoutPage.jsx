import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSuccess from '../components/OrderSuccess';
import { useStore } from '../context/StoreContext';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    paymentOption: 'cash',
    addNote: false,
    note: '',
  });

  const DELIVERY_CHARGE = 5.00;
  const totalWithDelivery = cartTotal + DELIVERY_CHARGE;

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    setOrderId(null);
    navigate('/');
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.address || cart.length === 0 || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const newOrder = await placeOrder(form);

      if (!newOrder || !newOrder.id) {
        console.error('placeOrder returned invalid order:', newOrder);
        alert('Checkout reached the backend, but no valid order was returned.');
        return;
      }

      const payload = {
        orderId: newOrder.id,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        total: Number(totalWithDelivery.toFixed(2)),
        paymentOption: form.paymentOption,
        createdAt: new Date().toISOString(),
        items: cart.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        fetch(`${SUPABASE_URL}/functions/v1/order-notify-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(payload),
        }).catch((error) => {
          console.error('Admin email failed:', error);
        });
      } else {
        console.warn('Supabase env vars missing: order-notify-admin was skipped.');
      }

      setShowSuccess(true);
      setOrderId(newOrder.id);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" style={{ maxWidth: '1200px' }}>
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-grid">
        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              rows="3"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Payment Options</label>
            <div className="form-options">
              <lab
              el className="form-option">
                <input
                  type="radio"
                  name="paymentOption"
                  value="cash"
                  checked={form.paymentOption === 'cash'}
                  onChange={(e) => setForm({ ...form, paymentOption: e.target.value })}
                />
                <span>Pay via Cash</span>
              </lab>
              <label className="form-option">
                <input
                  type="radio"
                  name="paymentOption"
                  value="whish"
                  checked={form.paymentOption === 'whish'}
                  onChange={(e) => setForm({ ...form, paymentOption: e.target.value })}
                />
                <span>Pay via Whish on 70394388</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-check">
              <input
                type="checkbox"
                checked={form.addNote}
                onChange={(e) => setForm({ ...form, addNote: e.target.checked })}
              />
              <span>Add note</span>
            </label>
{form.addNote && (
              <textarea
                className="note-textarea"
                rows="3"
                placeholder="Note about your order e.g. .."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
            By proceeding with your purchase you agree to our Terms and Conditions and Privacy Policy
          </p>

          <button className="btn btn-primary" type="submit" disabled={submitting || showSuccess}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
        {showSuccess && (
          <OrderSuccess 
            show={showSuccess} 
            orderId={orderId} 
            onClose={handleCloseSuccess} 
          />
        )}

        <div className="card">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <img 
                src={item.image} 
                alt={item.title} 
                className="cart-item-image" 
                style={{ width: '50px', height: '50px', objectFit: 'cover', flexShrink: 0 }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  × {item.quantity} • ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}

          <div className="cart-drawer-subtotal" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <span>Subtotal</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <div className="cart-drawer-subtotal">
            <span>Delivery Charge</span>
            <strong>${DELIVERY_CHARGE.toFixed(2)}</strong>
          </div>

          <div className="cart-drawer-subtotal" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)', fontSize: '1.1rem' }}>
            <span>Total</span>
            <strong>${totalWithDelivery.toFixed(2)}</strong>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
            Kindly note that delivery charges may differ depending on the size and weight of your order.
          </p>
        </div>
      </div>
    </section>
  );
}