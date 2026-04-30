import { useStore } from '../context/StoreContext';
import CategoryChips from './CategoryChips';

export default function ShopHeader({ title, chips = [], productCount, categorySlug, activeSlug }) {
  const { searchTerm, setSearchTerm, sortBy, setSortBy, openFilterDrawer } = useStore();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'title', label: 'Name A-Z' }
  ];

  return (
    <div className="shop-header">
      <div className="shop-title-row">
        <h1>{title}</h1>
        <span className="product-count">{productCount} products</span>
      </div>
      
      {/* Mobile filter + sort bar */}
      <div className="mobile-filter-bar">
        <button
          className="mobile-filter-btn"
          type="button"
          onClick={openFilterDrawer}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>

        <div className="mobile-sort-wrapper">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="shop-controls">
        <CategoryChips chips={chips} categorySlug={categorySlug} activeSlug={activeSlug} />
        <div className="search-sort-row">
          <input 
            type="text"
            className="shop-search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

