import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Discover Lebanese Luxury',
    text: 'Premium home essentials inspired by authentic Lebanese craftsmanship.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?w=1920&h=1080&fit=crop',
    btnText: 'Shop Collection',
    link: '#new-collection'
  },
  {
    title: 'Elegance in Every Detail',
    text: 'Soft luxury for your cozy home sanctuary.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
    btnText: 'Houseware',
    link: '/category/houseware'
  },
  {
    title: 'Timeless Lebanese Heritage',
    text: 'Handcrafted pieces that tell a story.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop',
    btnText: 'Home & Decor',
    link: '/category/home-decor'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      <div
        className="slider"
        style={{ transform: `translateX(${-currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            className="slide"
            key={index}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>

              {/* Button */}
              {slide.link.startsWith('#') ? (
                <a href={slide.link} className="cta-btn">
                  {slide.btnText}
                </a>
              ) : (
                <Link to={slide.link} className="cta-btn">
                  {slide.btnText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="slider-nav">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
}