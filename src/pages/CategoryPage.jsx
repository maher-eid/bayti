import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import FilterDrawer from '../components/FilterDrawer';
import ShopHeader from '../components/ShopHeader';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';
import { useStore } from '../context/StoreContext';

export default function CategoryPage() {
  const { slug, subSlug } = useParams();
  const { priceFilter, sortBy, searchTerm, selectedCategory, setSelectedCategory } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find((item) => item.slug === slug);

  const currentSubcategory = category?.subcategories?.find(
    (item) => item.slug === subSlug
  );

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

  useEffect(() => {
    setSelectedCategory('');
  }, [slug, setSelectedCategory]);

  const categoryProducts = useMemo(() => {
    let filtered = products
      .filter((item) => {
        const itemCategory = item.category_slug || item.category || '';
        const itemSubcategory = item.subcategory_slug || item.subcategory || '';

        const matchesCategory = itemCategory === slug;
        const matchesSubcategory = subSlug ? itemSubcategory === subSlug : true;

        return matchesCategory && matchesSubcategory;
      })
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

    // Apply selectedCategory filter if it's a valid subcategory filter
    if (selectedCategory && category && category.subcategories.some(sub => sub.slug === selectedCategory)) {
      filtered = filtered.filter((item) => {
        const itemSubcategory = item.subcategory_slug || item.subcategory || '';
        return itemSubcategory === selectedCategory;
      });
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();

      filtered = filtered.filter((product) =>
        (product.title || '').toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query)
      );
    }

    if (priceFilter && priceFilter !== 'all') {
      filtered = filtered.filter((product) => {
        const price = Number(product.price || 0);

        if (priceFilter === 'under50') return price < 50;
        if (priceFilter === '50-100') return price >= 50 && price <= 100;
        if (priceFilter === '100plus') return price > 100;

        return true;
      });
    }

    if (sortBy) {
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      }

      if (sortBy === 'price-high') {
        filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      }

      if (sortBy === 'title' || sortBy === 'name') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }
    }

    return filtered;
  }, [products, slug, subSlug, priceFilter, sortBy, searchTerm, selectedCategory, category]);

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

  const pageTitle = currentSubcategory
    ? `${category.name} - ${currentSubcategory.name}`
    : category.name;

  return (
    <section className="shop-page section">
      <div className="shop-layout">
        <FilterSidebar category={category} />

        <div className="shop-main">
          <ShopHeader
            title={pageTitle}
            chips={category.subcategories || []}
            categorySlug={slug}
            activeSlug={subSlug || ''}
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

      <FilterDrawer category={category} />
    </section>
  );
}