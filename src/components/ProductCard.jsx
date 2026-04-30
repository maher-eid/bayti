import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, simple }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const wished = wishlist.includes(product.id);
  const hasOptions = product.hasOptions === true;

  const stock = Number(product.stock_quantity ?? 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const priceValue = Number(product.price ?? 0);
  const formattedPrice = Number.isFinite(priceValue)
    ? priceValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : '';

  const buttonText = hasOptions
    ? 'Select Options'
    : isOutOfStock
      ? 'Out of Stock'
      : 'Add to Cart';

  const handleCardButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasOptions && !isOutOfStock) {
      addToCart(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className={`product-card image-only${simple ? ' simple' : ''}`}>
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product';
            }}
          />

          {isOutOfStock && (
            <button
              type="button"
              className="hover-btn glass-btn out-of-stock-btn"
              disabled={true}
            >
              Out of Stock
            </button>
          )}

          {!isOutOfStock && isLowStock && (
            <span className="stock-badge stock-badge-low">Only {stock} left</span>
          )}

          {!isOutOfStock && (
            <button
              type="button"
              className="hover-btn glass-btn"
              disabled={!hasOptions && isOutOfStock}
              onClick={handleCardButtonClick}
            >
              {buttonText}
            </button>
          )}

          <button
            type="button"
            className={`wishlist-btn ${wished ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wished ? '♥' : '♡'}
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">{formattedPrice}</p>
        </div>
      </Link>
    </article>
  );
}