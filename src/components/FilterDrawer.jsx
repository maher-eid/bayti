import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import FilterSidebar from './FilterSidebar';

export default function FilterDrawer({ category }) {
  const { isFilterDrawerOpen, closeFilterDrawer, clearFilters } = useStore();
  const [shouldRender, setShouldRender] = useState(isFilterDrawerOpen);

  useEffect(() => {
    if (isFilterDrawerOpen) {
      setShouldRender(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 380);

    return () => clearTimeout(timer);
  }, [isFilterDrawerOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFilterDrawerOpen) {
        closeFilterDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDrawerOpen, closeFilterDrawer]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeFilterDrawer();
    }
  };

  const handleClear = () => {
    clearFilters();
  };

  const handleApply = () => {
    closeFilterDrawer();
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`filter-drawer-overlay ${isFilterDrawerOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <aside
        className={`filter-drawer ${isFilterDrawerOpen ? 'open' : ''}`}
        aria-label="Filter products"
      >
        <div className="filter-drawer-header">
          <h3>Filters</h3>
          <button
            className="filter-drawer-close"
            onClick={closeFilterDrawer}
            type="button"
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        <div className="filter-drawer-body">
          <FilterSidebar category={category} mode="drawer" />
        </div>

        <div className="filter-drawer-footer">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleClear}
          >
            Clear All
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}

