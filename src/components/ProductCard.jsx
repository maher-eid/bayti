import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, simple = false }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const hasOptions = product.hasOptions === true;
  const buttonText = hasOptions ? 'Select Options' : 'Add to Cart';

  return (
    <div className={`product-card ${simple ? 'simple' : ''}`}>
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.title} loading="lazy" />
        </Link>
        <div className="hover-action">
          <button 
            className="cta-button" 
            onClick={(e) => {
              e.stopPropagation();
              if (!hasOptions) {
                addToCart(product);
              }
              // For hasOptions, clicking button does nothing extra - image Link handles navigation
            }}
          >
            {buttonText}
          </button>
        </div>
        <button 
          className={`wishlist-btn ${wished ? 'active' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
        >
          ♡
        </button>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3>{product.title}</h3>
        </Link>
        <p className="price">${product.price.toFixed(2)}</p>
        {!simple && <p className="category">{product.category.replace('-', ' ')}</p>}
      </div>
    </div>
  );
}

