import { Link } from 'react-router-dom';
import { categories } from '../data/ProductCategories/categories';

export default function CategoryCircles() {
  return (
    <section className="circle-categories">
      <div className="circle-categories-container">
        {categories.map((category) => (
          <Link key={category.slug} to={`/category/${category.slug}`} className="circle-category-card">
            <img src={category.image} alt={category.name} />
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
