import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { cartCount, cartTotal, wishlist, searchTerm, setSearchTerm, openCart } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Bayti Lebnani</Link>
      </div>

      <form className="search-container" onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="Search for home essentials..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="search-btn" type="submit">🔍</button>
      </form>

      <div className="nav-icons">
        <Link className="nav-icon" to="/admin/login" title="Admin">👤</Link>
        <div className="nav-icon" title="Wishlist">♡ <span className="cart-info">{wishlist.length}</span></div>
        <button 
          className="nav-icon cart-link" 
          onClick={() => openCart()} 
          title="Cart"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          🛒 <span className="cart-info">{cartCount}</span>
          <div className="cart-total">${cartTotal.toFixed(2)}</div>
        </button>
        <a href="https://wa.me/96176545166" className="nav-icon social-icon" title="WhatsApp" target="_blank" rel="noopener noreferrer">💬</a>
        <a href="tel:76545166" className="nav-icon social-icon" title="Call">📞</a>
        <a href="#" className="nav-icon social-icon" title="Facebook">📘</a>
        <a href="#" className="nav-icon social-icon" title="Instagram">📷</a>
      </div>
    </nav>
  );
}
