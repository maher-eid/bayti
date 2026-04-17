import { Link } from 'react-router-dom';
import { categories } from '../data/ProductCategories/categories';

export default function CategoryBar() {
  return (
    <section className="category-bar">
      <div className="category-container">
        {categories.map((category) => (
          <div className="category-item" key={category.slug}>
            <div className="category-title">
              <Link to={`/category/${category.slug}`}>{category.name}</Link>
              <span className="arrow">▼</span>
            </div>
            <div className="dropdown">
              {category.subcategories.map((sub) => (
                <Link 
                  to={`/category/${category.slug}/${sub.slug}`} 
                  key={sub.slug}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
