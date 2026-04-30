import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useEffect, useRef, useState } from 'react';

// lucide (UI icons)
import { ShoppingCart, Heart, User, Phone, MessageCircle, Search, Menu, X } from 'lucide-react';

// react-icons (brand icons)
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

// categories
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';
import { searchProducts } from '../utils/searchProducts';

function formatPrice(price) {
  const value = Number(price ?? 0);
  return Number.isFinite(value)
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '';
}

export default function Navbar() {
  const { cartCount, cartTotal, wishlist, searchTerm, setSearchTerm, openCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const lastScrollY = useRef(0);

  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Fetch all products once for search suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Fetch error:', error);
      } else {
        setProducts(
          (data || []).map((p) => ({
            ...p,
            image: p.main_image || p.image || '',
            category: p.category_slug || p.category || '',
            subcategory: p.subcategory_slug || p.subcategory || '',
          }))
        );
      }
    };
    fetchProducts();
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY <= 10) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true); // scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const trimmed = value.trim();
    if (trimmed.length >= 2) {
      const results = searchProducts(products, trimmed);
      setSuggestions(results.slice(0, 6));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowDropdown(false);
    navigate(`/product/${productId}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  const toggleCategory = (categorySlug) => {
    setExpandedCategory(expandedCategory === categorySlug ? null : categorySlug);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar') && !event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Hamburger Menu Button - Mobile Only */}
      <button
        className="hamburger-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="nav-left">
        <Link to="/" className="logo" onClick={closeMobileMenu}>Bayti Lebnani</Link>
      </div>

      <div ref={searchRef} className="search-container search-with-dropdown">
        <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative' }}>
          <Search className="search-icon" size={18} />
          <input
            className="search-input"
            placeholder="Search for home essentials..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
          />

          {showDropdown && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="search-dropdown-item"
                  onClick={() => handleSuggestionClick(product.id)}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/40x40?text=Product'}
                    alt={product.title}
                    className="search-dropdown-img"
                    loading="lazy"
                  />
                  <div className="search-dropdown-info">
                    <div className="search-dropdown-title">{product.title}</div>
                    <div className="search-dropdown-meta">
                      {formatPrice(product.price)} · {product.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="nav-icons">

        <Link className="nav-icon" to="/admin/login" title="Admin" onClick={closeMobileMenu}>
          <User size={20} />
        </Link>

        <Link className="nav-icon" to="/wishlist" title="Wishlist" onClick={closeMobileMenu}>
          <Heart size={20} />
          <span className="cart-info">{wishlist.length}</span>
        </Link>

        <Link
          className="nav-icon cart-link"
          to="/cart"
          title="Cart"
          onClick={closeMobileMenu}
        >
          <ShoppingCart size={20} />
          <span className="cart-info">{cartCount}</span>
          <div className="cart-total">${cartTotal.toFixed(2)}</div>
        </Link>

        <a
          href="https://wa.me/96176545166"
          className="nav-icon social-icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
        </a>

        <a href="tel:76545166" className="nav-icon social-icon">
          <Phone size={20} />
        </a>

        <a href="#" className="nav-icon social-icon">
          <FaFacebookF size={18} />
        </a>

        <a href="#" className="nav-icon social-icon">
          <FaInstagram size={18} />
        </a>

      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Categories with Subcategories */}
          {categories.map((category) => (
            <div key={category.slug} className="mobile-menu-category">
              {category.subcategories && category.subcategories.length > 0 ? (
                <>
                  <div className="mobile-menu-category-row">
                    <Link
                      to={`/category/${category.slug}`}
                      className="mobile-menu-category-link"
                      onClick={closeMobileMenu}
                    >
                      {category.name}
                    </Link>

                    <button
                      type="button"
                      className="mobile-menu-arrow-btn"
                      onClick={() => toggleCategory(category.slug)}
                      aria-label={`Toggle ${category.name} subcategories`}
                    >
                      <span className={`mobile-menu-arrow ${expandedCategory === category.slug ? 'open' : ''}`}>
                        ▼
                      </span>
                    </button>
                  </div>

                  {expandedCategory === category.slug && (
                    <div className="mobile-menu-subcategories">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          to={`/category/${category.slug}/${sub.slug}`}
                          className="mobile-menu-subcategory"
                          onClick={closeMobileMenu}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={`/category/${category.slug}`}
                  className="mobile-menu-category-link single"
                  onClick={closeMobileMenu}
                >
                  {category.name}
                </Link>
              )}
            </div>
          ))}
          <div className="mobile-menu-social">
            <a href="https://wa.me/96176545166" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} />
            </a>
            <a href="tel:76545166">
              <Phone size={20} />
            </a>
            <a href="#">
              <FaFacebookF size={18} />
            </a>
            <a href="#">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

