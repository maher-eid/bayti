import { useStore } from '../context/StoreContext';
import { categories } from '../data/ProductCategories/categories';

export default function FilterSidebar({ category, mode = 'sidebar' }) {
  const { setSortBy, priceFilter, setPriceFilter, selectedCategory, setSelectedCategory, clearFilters } = useStore();

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'under50', label: 'Under $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100plus', label: '$100+' }
  ];

  const handlePriceFilter = (rangeId) => {
    setPriceFilter(rangeId);
  };

  const handleCategoryFilter = (categorySlug) => {
    setSelectedCategory(selectedCategory === categorySlug ? '' : categorySlug);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const content = (
    <>
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="price-filters">
          {priceRanges.map((range) => (
            <label key={range.id} className="filter-checkbox">
              <input
                type="radio"
                name="price"
                value={range.id}
                checked={priceFilter === range.id}
                onChange={() => handlePriceFilter(range.id)}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>{category ? 'Subcategories' : 'Categories'}</h3>
        <div className="category-filters">
          {(category ? category.subcategories : categories.slice(0, 6)).map((cat) => (
            <label key={cat.slug} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCategory === cat.slug}
                onChange={() => handleCategoryFilter(cat.slug)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {mode === 'sidebar' && (
        <button className="clear-filters btn btn-secondary" onClick={handleClearFilters}>Clear All</button>
      )}
    </>
  );

  if (mode === 'drawer') {
    return content;
  }

  return (
    <aside className="filter-sidebar">
      {content}
    </aside>
  );
}
