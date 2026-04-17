import { useState } from 'react';

export default function ProductImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="product-gallery-placeholder">No images available</div>;
  }

  const thumbnails = images.slice(0, 5); // Show up to 5 thumbs

  return (
    <div className="product-image-gallery">
      <div className="main-image-container">
        <img 
          src={images[currentIndex]} 
          alt="Product main" 
          className="main-product-image"
        />
      </div>
      {thumbnails.length > 1 && (
        <div className="thumbnails-row">
          {thumbnails.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

