import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const product = useMemo(() => {
    return products.find((item) => Number(item.id) === Number(id));
  }, [products, id]);

  const mappedProduct = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      image: product.main_image || product.image || '',
      images: Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.main_image
          ? [product.main_image]
          : product.image
            ? [product.image]
            : [],
      category: product.category_slug || product.category || '',
      subcategory: product.subcategory_slug || product.subcategory || '',
      additionalInfo: Array.isArray(product.additional_info)
        ? product.additional_info
        : Array.isArray(product.additionalInfo)
          ? product.additionalInfo
          : [],
      hasOptions: Boolean(product.has_options ?? product.hasOptions),
    };
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!mappedProduct) return [];

    return products
      .filter(
        (p) =>
          (p.category_slug || p.category) === mappedProduct.category &&
          Number(p.id) !== Number(mappedProduct.id)
      )
      .slice(0, 4)
      .map((p) => ({
        ...p,
        image: p.main_image || p.image || '',
        images: Array.isArray(p.images) ? p.images : [],
        category: p.category_slug || p.category || '',
        subcategory: p.subcategory_slug || p.subcategory || '',
        additionalInfo: Array.isArray(p.additional_info)
          ? p.additional_info
          : Array.isArray(p.additionalInfo)
            ? p.additionalInfo
            : [],
        hasOptions: Boolean(p.has_options ?? p.hasOptions),
      }));
  }, [products, mappedProduct]);

  const addMultipleToCart = () => {
    if (!mappedProduct) return;

    for (let i = 0; i < qty; i += 1) {
      addToCart(mappedProduct);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <p>Loading product...</p>
      </section>
    );
  }

  if (!mappedProduct) {
    return (
      <section className="section">
        <p>Product not found.</p>
      </section>
    );
  }

  const features =
    mappedProduct.additionalInfo.length > 0
      ? mappedProduct.additionalInfo.slice(0, 4)
      : [
          `SKU: ${mappedProduct.id}`,
          `Category: ${mappedProduct.category.replace(/-/g, ' ')}`,
          mappedProduct.subcategory
            ? `Subcategory: ${mappedProduct.subcategory.replace(/-/g, ' ')}`
            : 'Available now',
          'Added to our collection',
        ];

  const additionalInfo =
    mappedProduct.additionalInfo.length > 0
      ? mappedProduct.additionalInfo
      : [
          `SKU: ${mappedProduct.id}`,
          `Category: ${mappedProduct.category.replace(/-/g, ' ')}`,
          mappedProduct.subcategory
            ? `Subcategory: ${mappedProduct.subcategory.replace(/-/g, ' ')}`
            : 'Subcategory: N/A',
        ];

  return (
    <section className="product-details-page shop-page section">
      <div className="product-main-layout">
        <ProductImageGallery
          images={mappedProduct.images.length > 0 ? mappedProduct.images : [mappedProduct.image]}
          title={mappedProduct.title}
        />

        <div className="product-details">
          <h1 className="product-title">{mappedProduct.title}</h1>
          <p className="product-sku">SKU: {mappedProduct.id}</p>
          <p className="product-category">
            {(mappedProduct.category || '').replace(/-/g, ' ').toUpperCase()}
          </p>

          {mappedProduct.subcategory && (
            <p className="product-category">
              {(mappedProduct.subcategory || '').replace(/-/g, ' ')}
            </p>
          )}

          <p className="product-price-large">
            ${Number(mappedProduct.price || 0).toFixed(2)}
          </p>

          <ul className="product-features">
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`}>{feature}</li>
            ))}
          </ul>

          {mappedProduct.hasOptions && (
            <p className="product-options-note">This product has selectable options.</p>
          )}

          <div className="quantity-section">
            <label htmlFor="qty-input">Quantity:</label>
            <input
              id="qty-input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="qty-input"
            />
          </div>

          <div className="product-actions">
            <button className="btn btn-primary btn-large" onClick={addMultipleToCart}>
              Add {qty} to Cart
            </button>

            <button
              className={`btn btn-secondary btn-large ${
                wishlist.includes(mappedProduct.id) ? 'btn-wishlist-active' : ''
              }`}
              onClick={() => toggleWishlist(mappedProduct.id)}
            >
              {wishlist.includes(mappedProduct.id) ? 'Wishlisted ♥' : 'Add to Wishlist ♥'}
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs-section">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
            onClick={() => setActiveTab('desc')}
          >
            Description
          </button>

          <button
            className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
            onClick={() => setActiveTab('additional')}
          >
            Additional Information
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'desc' ? (
            <div className="tab-pane">
              <p>{mappedProduct.description || 'No description available.'}</p>
            </div>
          ) : (
            <div className="tab-pane">
              <ul>
                {additionalInfo.map((info, index) => (
                  <li key={`${info}-${index}`}>{info}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Related Products</h2>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {showSticky && (
        <div className="sticky-purchase-bar">
          <div className="sticky-price">
            ${Number(mappedProduct.price || 0).toFixed(2)}
          </div>

          <div className="sticky-actions">
            <button className="btn btn-primary" onClick={addMultipleToCart}>
              Add {qty} to Cart
            </button>
            <button className="sticky-close" onClick={() => setShowSticky(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}