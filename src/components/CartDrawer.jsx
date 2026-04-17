import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const { cart, cartTotal, isCartOpen, closeCart, updateCartQuantity, removeFromCart } = useStore();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="cart-drawer-overlay open" 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button className="cart-drawer-close" onClick={closeCart}>×</button>
        </div>
        
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <p className="empty-cart-text">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-drawer-item" key={item.id}>
                <img src={item.image} alt={item.title} className="cart-drawer-item-image" />
                <div className="cart-drawer-item-info">
                  <h4>{item.title}</h4>
                  <p className="cart-drawer-item-price">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateCartQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateCartQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  className="cart-drawer-remove" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <div className="cart-drawer-actions">
              <Link to="/cart" className="cart-btn view-cart-btn" onClick={closeCart}>
                View Cart
              </Link>
              <Link to="/checkout" className="cart-btn checkout-btn" onClick={closeCart}>
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
