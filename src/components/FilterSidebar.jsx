import { useStore } from '../context/StoreContext';
import { categories } from '../data/ProductCategories/categories';

export default function FilterSidebar() {
  const { sortedProducts, setSortBy } = useStore();

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'under50', label: 'Under $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100plus', label: '$100+' }
  ];

  const handlePriceFilter = (rangeId) => {
    // Future: implement price filter logic
    console.log('Price filter:', rangeId);
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="price-filters">
          {priceRanges.map((range) => (
            <label key={range.id} className="filter-checkbox">
              <input 
                type="radio" 
                name="price" 
                value={range.id}
                onChange={() => handlePriceFilter(range.id)}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Categories</h3>
        <div className="category-filters">
          {categories.slice(0, 6).map((cat) => (
            <label key={cat.slug} className="filter-checkbox">
              <input type="checkbox" />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="clear-filters btn btn-secondary">Clear All</button>
    </aside>
  );
}
