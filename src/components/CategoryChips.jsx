import { Link } from 'react-router-dom';

export default function CategoryChips({ chips, categorySlug, activeSlug = '' }) {
  return (
    <div className="category-chips">
      {chips.map((chip, index) => (
        <Link 
          key={chip.slug || index}
          to={categorySlug ? `/category/${categorySlug}/${chip.slug}` : `#`}
          className={`chip ${activeSlug === (chip.slug || chip.id) ? 'active' : ''}`}
        >
          {chip.name || chip.title}
        </Link>
      ))}
    </div>
  );
}
