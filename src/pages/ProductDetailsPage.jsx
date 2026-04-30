import { useParams, Link } from 'react-router-dom';
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
      const { data, error } = await supabase.from('products').select('*');

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
    const handleScroll = () => setShowSticky(window.scrollY > 450);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const product = useMemo(() => {
    return products.find((item) => Number(item.id) === Number(id));
  }, [products, id]);

  const mappedProduct = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      stock_quantity: Number(product.stock_quantity ?? 0),
      image: product.main_image || product.image || '',
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : product.main_image
            ? [product.main_image]
            : product.image
              ? [product.image]
              : [],
      category: product.category_slug || product.category || '',
      subcategory: product.subcategory_slug || product.subcategory || '',
      additionalInfo: Array.isArray(product.additional_info) ? product.additional_info : [],
      hasOptions: Boolean(product.has_options),
    };
  }, [product]);

  const stock = Number(mappedProduct?.stock_quantity ?? 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const maxQty = Math.max(1, stock);
  const isWishlisted = mappedProduct ? wishlist.includes(mappedProduct.id) : false;

  const relatedProducts = useMemo(() => {
    if (!mappedProduct) return [];

    // First try to find products with the same subcategory
    const sameSubcategoryProducts = products.filter(
      (p) =>
        (p.subcategory_slug || p.subcategory) === mappedProduct.subcategory &&
        mappedProduct.subcategory &&
        Number(p.id) !== Number(mappedProduct.id)
    );

    // If not enough products in same subcategory, fallback to same category
    const sameCategoryProducts = products.filter(
      (p) =>
        (p.category_slug || p.category) === mappedProduct.category &&
        Number(p.id) !== Number(mappedProduct.id)
    );

    const source =
      sameSubcategoryProducts.length >= 4
        ? sameSubcategoryProducts.slice(0, 4)
        : sameCategoryProducts.length >= 4
          ? sameCategoryProducts.slice(0, 4)
          : products.filter((p) => Number(p.id) !== Number(mappedProduct.id)).slice(-4);

    return source.map((p) => ({
      ...p,
      stock_quantity: Number(p.stock_quantity ?? 0),
      image: p.main_image || p.image || '',
      images: Array.isArray(p.images) ? p.images : [],
      category: p.category_slug || p.category || '',
      subcategory: p.subcategory_slug || p.subcategory || '',
      additionalInfo: Array.isArray(p.additional_info) ? p.additional_info : [],
      hasOptions: Boolean(p.has_options),
    }));
  }, [products, mappedProduct]);

  const features = useMemo(() => {
    if (!mappedProduct) return [];

    if (mappedProduct.additionalInfo.length > 0) {
      return mappedProduct.additionalInfo.slice(0, 4);
    }

    return [
      `SKU: ${mappedProduct.id}`,
      `Category: ${(mappedProduct.category || 'General').replace(/-/g, ' ')}`,
      mappedProduct.subcategory
        ? `Subcategory: ${mappedProduct.subcategory.replace(/-/g, ' ')}`
        : 'Ready for everyday use',
      'Selected for our curated collection',
    ];
  }, [mappedProduct]);

  const additionalInfo = useMemo(() => {
    if (!mappedProduct) return [];

    if (mappedProduct.additionalInfo.length > 0) {
      return mappedProduct.additionalInfo;
    }

    return [
      `SKU: ${mappedProduct.id}`,
      `Category: ${(mappedProduct.category || 'General').replace(/-/g, ' ')}`,
      mappedProduct.subcategory
        ? `Subcategory: ${mappedProduct.subcategory.replace(/-/g, ' ')}`
        : 'Subcategory: N/A',
      `Stock Available: ${stock}`,
    ];
  }, [mappedProduct, stock]);

  const stockLabel = isOutOfStock
    ? 'Out of Stock'
    : isLowStock
      ? `Only ${stock} left`
      : 'In Stock';

  const stockClass = isOutOfStock
    ? 'stock-out'
    : isLowStock
      ? 'stock-low'
      : 'stock-in';

  const increaseQty = () => {
    if (isOutOfStock) return;
    setQty((prev) => Math.min(prev + 1, maxQty));
  };

  const decreaseQty = () => {
    setQty((prev) => Math.max(prev - 1, 1));
  };

  const addMultipleToCart = () => {
    if (!mappedProduct || isOutOfStock) return;

    const safeQty = Math.min(qty, stock);

    for (let i = 0; i < safeQty; i += 1) {
      addToCart(mappedProduct);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="product-state-message">Loading product...</div>
      </section>
    );
  }

  if (!mappedProduct) {
    return (
      <section className="section">
        <div className="product-state-message">Product not found.</div>
      </section>
    );
  }

  return (
    <section className="product-details-page section">
      <div className="product-main-layout">
        <ProductImageGallery
          images={mappedProduct.images.length ? mappedProduct.images : [mappedProduct.image]}
          title={mappedProduct.title}
        />

        <div className="product-details-panel">
          <Link to={`/category/${mappedProduct.category}`} className="product-category">
            {(mappedProduct.category || 'Collection').replace(/-/g, ' ')}
          </Link>

          <h1 className="product-title">{mappedProduct.title}</h1>

          {mappedProduct.subcategory && (
            <Link to={`/category/${mappedProduct.category}/${mappedProduct.subcategory}`} className="product-subcategory">
              {(mappedProduct.subcategory || '').replace(/-/g, ' ')}
            </Link>
          )}

          <div className="product-meta-row">
            <p className="product-price-large">
              ${Number(mappedProduct.price || 0).toFixed(2)}
            </p>

            <span className={`stock-badge product-stock-badge ${stockClass}`}>
              {stockLabel}
            </span>
          </div>

          <ul className="product-features">
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`}>{feature}</li>
            ))}
          </ul>

          {mappedProduct.hasOptions && (
            <div className="product-options-note">
              This product has selectable options.
            </div>
          )}

          <div className="quantity-section">
            <span className="quantity-label">Quantity</span>

            <div className="quantity-stepper">
              <button type="button" onClick={decreaseQty} disabled={qty <= 1 || isOutOfStock}>
                -
              </button>

              <span>{qty}</span>

              <button type="button" onClick={increaseQty} disabled={qty >= maxQty || isOutOfStock}>
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              type="button"
              className="btn btn-primary btn-large product-add-btn"
              onClick={addMultipleToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : `Add ${qty} to Cart`}
            </button>

            <button
              type="button"
              className={`btn btn-secondary btn-large product-wishlist-btn ${
                isWishlisted ? 'btn-wishlist-active' : ''
              }`}
              onClick={() => toggleWishlist(mappedProduct.id)}
            >
              {isWishlisted ? 'Wishlisted ♥' : 'Add to Wishlist ♥'}
            </button>
          </div>
        </div>
      </div>

      <section className="product-info-center-section">
        <div className="product-tabs-section">
          <div className="tabs-nav">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Description
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Information
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'desc' ? (
              <p>{mappedProduct.description || 'No description available.'}</p>
            ) : (
              <ul>
                {additionalInfo.map((info, index) => (
                  <li key={`${info}-${index}`}>{info}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

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
          <div className="sticky-product-summary">
            <div className="sticky-product-title">{mappedProduct.title}</div>
            <div className="sticky-product-price">
              ${Number(mappedProduct.price || 0).toFixed(2)} · {stockLabel}
            </div>
          </div>

          <button
            type="button"
            onClick={addMultipleToCart}
            disabled={isOutOfStock}
            className="btn btn-primary sticky-add-btn"
          >
            {isOutOfStock ? 'Out of Stock' : `Add ${qty} to Cart`}
          </button>
        </div>
      )}
    </section>
  );
}