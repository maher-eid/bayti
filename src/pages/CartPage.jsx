import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const { cart, cartCount, cartTotal, updateCartQuantity, removeFromCart } = useStore();

  return (
    <section className="section" style={{ maxWidth: '1200px' }}>
      <h1 className="section-title">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {cart.map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                <h3 style={{ marginTop: '1rem' }}>{item.title}</h3>
                <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-secondary" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="cart-drawer-subtotal"><span>{cartCount} items</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </section>
  );
}
