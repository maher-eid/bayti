import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';
import { uploadProductImages } from '../utils/uploadProductImages';

export default function AdminAddProductPage() {
  const { adminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0]?.slug || '',
    subcategory: '',
    price: '',
    additionalInfo: '',
    hasOptions: false,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length === 0) return;

    const newEntries = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newEntries]);
    setSelectedFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const removePreview = useCallback((removeId) => {
    setImagePreviews((prev) => {
      const itemToRemove = prev.find((p) => p.id === removeId);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((p) => p.id !== removeId);
    });

    setSelectedFiles((prev) => prev.filter((p) => p.id !== removeId));
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const filesOnly = selectedFiles.map((item) => item.file);
      const imageUrls = await uploadProductImages(filesOnly);

      const additionalInfo = form.additionalInfo
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        description: form.description || null,
        category_slug: form.category,
        subcategory_slug: form.subcategory || null,
        price: Number(form.price),
        main_image: imageUrls[0] || null,
        images: imageUrls,
        additional_info: additionalInfo,
        has_options: form.hasOptions,
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) throw insertError;

      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });

      setForm({
        title: '',
        description: '',
        category: categories[0]?.slug || '',
        subcategory: '',
        price: '',
        additionalInfo: '',
        hasOptions: false,
      });
      setImagePreviews([]);
      setSelectedFiles([]);

      alert('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Product creation error:', err);
      setError(err.message || 'Failed to create product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, [imagePreviews]);

  if (!adminLoggedIn) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Admin Access Required</h2>
        <Link to="/admin/login">Login as Admin</Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
        }}
      >
        <Link to="/admin/products" className="btn btn-secondary">
          &larr; Back to Products
        </Link>
        <h1>Add New Product</h1>
      </div>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            marginBottom: '1rem',
          }}
        >
          ❌ {error}
        </div>
      )}

      <form onSubmit={addProduct} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subcategory (optional)</label>
            <input
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Info (one per line)</label>
          <textarea
            rows="3"
            placeholder="Feature 1&#10;Feature 2&#10;etc..."
            value={form.additionalInfo}
            onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.hasOptions}
              onChange={(e) => setForm({ ...form, hasOptions: e.target.checked })}
            />
            Has color/size options
          </label>
        </div>

        <div className="form-group">
          <label>Images * (main image first)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
          />

          <div
            className="image-previews"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {imagePreviews.map((preview) => (
              <div
                key={preview.id}
                className="preview-item"
                style={{
                  position: 'relative',
                  width: '100px',
                }}
              >
                <img
                  src={preview.previewUrl}
                  alt="Preview"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePreview(preview.id)}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {selectedFiles.length === 0 && (
            <p style={{ color: 'gray', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Upload images - first becomes main image
            </p>
          )}

          <p style={{ color: 'gray', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {selectedFiles.length} image(s) selected
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          disabled={loading || selectedFiles.length === 0}
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}