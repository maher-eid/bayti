import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const mapped = products
        .filter((p) => wishlist.includes(p.id))
        .map((product) => ({
          id: product.id,
          title: product.title,
          price: Number(product.price || 0),
          stock_quantity: Number(product.stock_quantity ?? 0),
          image: product.main_image || product.image || '',
        }));
      setWishlistProducts(mapped);
    }
  }, [products, wishlist]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load wishlist products');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: '#dc2626' };
    if (stock <= 5) return { text: 'Low Stock', color: '#d97706' };
    return { text: 'In Stock', color: '#15803d' };
  };

  const handleRemove = (id) => {
    toggleWishlist(id);
  };

  const handleAddToCart = (product) => {
    if (product.stock_quantity > 0) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <section className="section" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading your wishlist...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</div>
        <button 
          onClick={fetchProducts}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="wishlist-page section">

      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.2rem', 
              fontWeight: 700, 
              color: '#111827', 
              margin: 0 
            }}>
              Your Wishlist
            </h1>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0' }}>
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <Link 
              to="/cart" 
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              View Cart
            </Link>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem',
              opacity: 0.5 
            }}>
              ♡
            </div>
            <h2 style={{ 
              fontSize: '1.8rem', 
              color: '#1e293b', 
              marginBottom: '1rem' 
            }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Save products you like for later.
            </p>
            <Link 
              to="/" 
              style={{
                display: 'inline-block',
                padding: '1.25rem 3rem',
                background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'none'}
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="wishlist-table-container" style={{ 
            background: 'white', 
            borderRadius: '20px', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <table className="wishlist-table" style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.95rem'
            }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '1.5rem 1rem 1rem 2rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Product</th>
                  <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Price</th>
                  <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Stock</th>
                  <th style={{ padding: '1.5rem 1rem 2rem 2rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlistProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity);
                  return (
                    <tr key={product.id} style={{ borderTop: '1px solid #f1f5f9' }}>
<td data-label="Product" style={{ padding: '1.5rem 1rem 1.5rem 2rem', verticalAlign: 'top' }}>
                        <div className="wishlist-product" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '12px', 
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }}
                              />
                            ) : (
                              'No image'
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/product/${product.id}`}
                              style={{
                                color: '#111827',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                display: 'block',
                                marginBottom: '0.25rem'
                              }}
                            >
                              {product.title}
                            </Link>
                          </div>
                                                  </div>
                      </td>
                      <td data-label="Price" style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td data-label="Stock" style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                        <span 
                          style={{
                            background: `${stockStatus.color}15`,
                            color: stockStatus.color,
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            border: `1px solid ${stockStatus.color}30`
                          }}
                        >
                          {stockStatus.text}
                        </span>
                      </td>
                      <td data-label="Actions" style={{ padding: '1.5rem 1rem 1.5rem 2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div className="wishlist-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                            style={{
                              padding: '0.75rem 1.5rem',
                              borderRadius: '10px',
                              border: '1px solid #d1d5db',
                              background: product.stock_quantity === 0 ? '#f3f4f6' : 'white',
                              color: product.stock_quantity === 0 ? '#9ca3af' : '#111827',
                              fontWeight: 600,
                              cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer',
                              minWidth: '120px'
                            }}
                          >
                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => handleRemove(product.id)}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              minWidth: '120px'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
