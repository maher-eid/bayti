import { useState } from 'react';

export default function ProductImageGallery({ images = [], title = 'Product image' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="product-gallery-placeholder">No images available</div>;
  }

  const thumbnails = images.slice(0, 5);

  return (
    <div className="product-image-gallery">
      <div className="main-image-container">
        <img
          src={images[currentIndex]}
          alt={title}
          className="main-product-image"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/700x900?text=Product';
          }}
        />
      </div>

      {thumbnails.length > 1 && (
        <div className="thumbnails-row">
          {thumbnails.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              className={`thumbnail-btn ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View product image ${index + 1}`}
            >
              <img src={img} alt={`${title} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
