import { useStore } from '../context/StoreContext';
import CategoryChips from './CategoryChips';

export default function ShopHeader({ title, chips = [], productCount }) {
  const { searchTerm, setSearchTerm, sortBy, setSortBy } = useStore();

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
      
      <div className="shop-controls">
        <CategoryChips chips={chips} />
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

