import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { searchProducts } from '../utils/searchProducts';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');

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

  const mappedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      image: p.main_image || p.image || '',
      images: Array.isArray(p.images) ? p.images : [],
      category: p.category_slug || p.category || '',
      subcategory: p.subcategory_slug || p.subcategory || '',
      additionalInfo: Array.isArray(p.additional_info) ? p.additional_info : [],
      hasOptions: Boolean(p.has_options),
    }));
  }, [products]);

  const results = useMemo(() => {
    return searchProducts(mappedProducts, query);
  }, [mappedProducts, query]);

  if (loading) {
    return (
      <section className="section">
        <p>Loading search results...</p>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="section-title">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>
      {results.length > 0 ? (
        <div className="products-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem 0' }}>
          No products found.
        </p>
      )}
    </section>
  );
}

