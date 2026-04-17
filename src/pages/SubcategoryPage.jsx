import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import ShopHeader from '../components/ShopHeader';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';

export default function SubcategoryPage() {
  const { slug: mainSlug, subSlug } = useParams();
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
  const subcategoryProducts = useMemo(() => 
    products.filter(
      (product) =>
        product.category_slug === mainSlug &&
        (!product.subcategory_slug || product.subcategory_slug === subSlug)
    ),
    [products, mainSlug, subSlug]
  );

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
                <ProductCard key={product.id} product={{
                  ...product,
                  image: product.main_image,
                  images: product.images
                }} />
              ))
            ) : (
              <p>No products in this subcategory yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}