import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import ShopHeader from '../components/ShopHeader';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find((item) => item.slug === slug);

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

  const categoryProducts = useMemo(() => {
    return products
      .filter((item) => (item.category_slug || item.category) === slug)
      .map((item) => ({
        ...item,
        image: item.main_image || item.image || '',
        images: Array.isArray(item.images) ? item.images : [],
        category: item.category_slug || item.category || '',
        subcategory: item.subcategory_slug || item.subcategory || '',
        additionalInfo: Array.isArray(item.additional_info)
          ? item.additional_info
          : Array.isArray(item.additionalInfo)
            ? item.additionalInfo
            : [],
        hasOptions: Boolean(item.has_options ?? item.hasOptions),
      }));
  }, [products, slug]);

  if (loading) {
    return (
      <section className="section">
        <p>Loading products...</p>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="section">
        <p>Category not found.</p>
      </section>
    );
  }

  const subcatChips = category.subcategories || [];

  return (
    <section className="shop-page section">
      <div className="shop-layout">
        <FilterSidebar />

        <div className="shop-main">
          <ShopHeader
            title={category.name}
            chips={subcatChips}
            activeSlug=""
            productCount={categoryProducts.length}
          />

          <div className="products-grid">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}