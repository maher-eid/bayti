import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM SUPABASE
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 DELETE FROM SUPABASE
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Delete failed');
      console.error(error);
    } else {
      fetchProducts(); // refresh list
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>
                <img
                  src={product.main_image || product.images?.[0]}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              </td>

              <td>{product.title}</td>

              <td>
                {categories.find(c => c.slug === product.category_slug)?.name || product.category_slug}
              </td>

              <td>${Number(product.price).toFixed(2)}</td>

              <td>
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="btn btn-secondary"
                  style={{ marginRight: '0.5rem' }}
                >
                  Edit
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p>No products yet. <Link to="/admin/products/new">Add one</Link></p>
      )}
    </div>
  );
}