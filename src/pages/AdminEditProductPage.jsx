import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { categories } from '../data/ProductCategories/categories';
import { supabase } from '../lib/supabase';
import { uploadProductImages } from '../utils/uploadProductImages';

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0]?.slug || '',
    subcategory: '',
    price: '',
    additionalInfo: '',
    hasOptions: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error(fetchError);
        setError(fetchError.message || 'Failed to load product');
        setLoading(false);
        return;
      }

      setProduct(data);
      setForm({
        title: data.title || '',
        description: data.description || '',
        category: data.category_slug || categories[0]?.slug || '',
        subcategory: data.subcategory_slug || '',
        price: data.price ?? '',
        additionalInfo: Array.isArray(data.additional_info)
          ? data.additional_info.join('\n')
          : '',
        hasOptions: !!data.has_options,
      });

      const initialImages = Array.isArray(data.images)
        ? data.images.filter(Boolean)
        : data.main_image
          ? [data.main_image]
          : [];

      setExistingImages(initialImages);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    const entries = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewFiles((prev) => [...prev, ...entries]);
    setNewPreviews((prev) => [...prev, ...entries]);
  }, []);

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewPreview = useCallback((removeId) => {
    setNewPreviews((prev) => {
      const item = prev.find((p) => p.id === removeId);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== removeId);
    });

    setNewFiles((prev) => prev.filter((p) => p.id !== removeId));
  }, []);

  const updateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let uploadedUrls = [];

      if (newFiles.length > 0) {
        uploadedUrls = await uploadProductImages(newFiles.map((item) => item.file));
      }

      const allImages = [...existingImages, ...uploadedUrls];
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
        main_image: allImages[0] || null,
        images: allImages,
        additional_info: additionalInfo,
        has_options: form.hasOptions,
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

      if (updateError) throw updateError;

      newPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });

      navigate('/admin/products');
    } catch (err) {
      console.error('Update product error:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      newPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, [newPreviews]);

  if (loading) return <p>Loading product...</p>;
  if (error && !product) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <Link to="/admin/products" className="btn btn-secondary">
          &larr; Back
        </Link>
        <h1>
          Edit Product #{product.id} - {product.title}
        </h1>
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

      <form onSubmit={updateProduct} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
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
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subcategory</label>
            <input
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
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
            Has options
          </label>
        </div>

        <div className="form-group">
          <label>Existing Images</label>
          <div
            className="image-previews"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}
          >
            {existingImages.map((img, index) => (
              <div
                key={`existing-${index}`}
                className="preview-item"
                style={{ position: 'relative', width: '100px' }}
              >
                <img
                  src={img}
                  alt="Existing"
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
                  onClick={() => removeExistingImage(index)}
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
        </div>

        <div className="form-group">
          <label>Add More Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={saving}
          />

          <div
            className="image-previews"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}
          >
            {newPreviews.map((preview) => (
              <div
                key={preview.id}
                className="preview-item"
                style={{ position: 'relative', width: '100px' }}
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
                  onClick={() => removeNewPreview(preview.id)}
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
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem' }}
          disabled={saving}
        >
          {saving ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}