import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  const [shouldRender, setShouldRender] = useState(isCartOpen);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 380);

    return () => clearTimeout(timer);
  }, [isCartOpen]);

  const handleClose = () => {
    closeCart();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <aside
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        aria-label="Shopping cart"
      >
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>

          <button
            className="cart-drawer-close"
            onClick={handleClose}
            type="button"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <p className="empty-cart-text">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-drawer-item" key={item.id}>
                <Link
                  to={`/product/${item.id}`}
                  className="cart-drawer-item-image-link"
                  onClick={handleClose}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-drawer-item-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/72x72?text=Item';
                    }}
                  />
                </Link>

                <div className="cart-drawer-item-info">
                  <h4>{item.title}</h4>

                  <p className="cart-drawer-item-price">
                    ${Number(item.price).toFixed(2)} × {item.quantity}
                  </p>

                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="qty-btn"
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="cart-drawer-remove"
                  type="button"
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
              <Link to="/cart" className="cart-btn view-cart-btn" onClick={handleClose}>
                View Cart
              </Link>

              <Link to="/checkout" className="cart-btn checkout-btn" onClick={handleClose}>
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}