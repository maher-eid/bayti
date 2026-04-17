import { useEffect, useState, useMemo } from 'react';
import CategoryCircles from '../components/CategoryCircles';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const { searchTerm } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM SUPABASE
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Fetch error:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 🔥 MAP DATA (VERY IMPORTANT)
  const mappedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      image: p.main_image || p.image || '',
      images: Array.isArray(p.images) ? p.images : [],
      category: p.category_slug || p.category || '',
      subcategory: p.subcategory_slug || p.subcategory || '',
      additionalInfo: Array.isArray(p.additional_info)
        ? p.additional_info
        : [],
      hasOptions: Boolean(p.has_options),
    }));
  }, [products]);

  // 🔍 SEARCH
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return mappedProducts;

    return mappedProducts.filter((product) =>
      [product.title, product.description, product.category]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(q))
    );
  }, [mappedProducts, searchTerm]);

  const newCollection = filtered.slice(0, 8);
  const bestSellers = filtered.slice(0, 6);
  const recommended = filtered.slice(-4);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Loading products...</p>;
  }

  return (
    <>
      <CategoryCircles />
      <HeroSlider />

      <section className="section" id="new-collection">
        <h2 className="section-title">New Collection</h2>
        <div className="products-slider">
          {newCollection.map((product) => (
            <ProductCard key={product.id} product={product} simple />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="products-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">You Might Be Interested In</h2>
        <div className="products-grid">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} simple />
          ))}
        </div>
      </section>
    </>
  );
}