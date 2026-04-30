import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import FilterDrawer from '../components/FilterDrawer';
import ShopHeader from '../components/ShopHeader';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';
import { useStore } from '../context/StoreContext';

export default function SubcategoryPage() {
  const { slug: mainSlug, subSlug } = useParams();
  const { priceFilter, sortBy, searchTerm } = useStore();
  const [products, setProducts] = useState([]);

  const parentCategory = categories.find((cat) => cat.slug === mainSlug);

  // 🔥 FETCH FROM SUPABASE
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Fetch error:', error);
      } else {
        setProducts(data || []);
      }
    };

    fetchProducts();
  }, []);

  // 🔥 FILTER
  const subcategoryProducts = useMemo(() => {
    let filtered = products
      .filter(
        (product) =>
          product.category_slug === mainSlug &&
          (!product.subcategory_slug || product.subcategory_slug === subSlug)
      )
      .map((product) => ({
        ...product,
        image: product.main_image || product.image || '',
        images: Array.isArray(product.images) ? product.images : [],
        category: product.category_slug || product.category || '',
        subcategory: product.subcategory_slug || product.subcategory || '',
        additionalInfo: Array.isArray(product.additional_info) ? product.additional_info : [],
        hasOptions: Boolean(product.has_options),
      }));

    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        (product.title || '').toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query)
      );
    }

    // Apply price filter
    if (priceFilter && priceFilter !== 'all') {
      filtered = filtered.filter((product) => {
        const price = Number(product.price || 0);
        if (priceFilter === 'under50') return price < 50;
        if (priceFilter === '50-100') return price >= 50 && price <= 100;
        if (priceFilter === '100plus') return price > 100;
        return true;
      });
    }

    // Apply sorting
    if (sortBy) {
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      } else if (sortBy === 'title' || sortBy === 'name') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }
    }

    return filtered;
  }, [products, mainSlug, subSlug, priceFilter, sortBy, searchTerm]);

  if (!parentCategory) {
    return <section className="section"><p>Category not found.</p></section>;
  }

  const subcat = parentCategory.subcategories.find((s) => s.slug === subSlug);
  const title = `${parentCategory.name} - ${subcat?.name || subSlug}`;

  return (
    <section className="shop-page section">
      <div className="shop-layout">
        <FilterSidebar />

        <div className="shop-main">
          <ShopHeader 
            title={title}
            chips={parentCategory.subcategories || []}
            activeSlug={subSlug}
            productCount={subcategoryProducts.length}
          />

          <div className="products-grid">
            {subcategoryProducts.length ? (
              subcategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer />
    </section>
  );
}