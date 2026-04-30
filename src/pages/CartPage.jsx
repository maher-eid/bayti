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
          <div className="cart-products-grid">
{cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{item.title}</h3>
                  </Link>
                  <p className="cart-price">${item.price.toFixed(2)}</p>
                  <div className="cart-qty">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <p className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="cart-drawer-subtotal"><span>{cartCount} items</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>Proceed to Checkout</Link>
          </div>
        </>
      )}
    </section>
  );
}
