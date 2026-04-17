const slides = [
  {
    title: 'Discover Lebanese Luxury',
    text: 'Premium home essentials inspired by authentic Lebanese craftsmanship.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?w=1920&h=1080&fit=crop'
  },
  {
    title: 'Elegance in Every Detail',
    text: 'Soft luxury for your cozy home sanctuary.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop'
  },
  {
    title: 'Timeless Lebanese Heritage',
    text: 'Handcrafted pieces that tell a story.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop'
  }
];

export default function HeroSlider() {
  return (
    <section className="hero">
      <div className="slider" style={{ transform: 'translateX(0%)' }}>
        {slides.map((slide) => (
          <div className="slide" key={slide.title} style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <a href="#new-collection" className="cta-btn">Shop Collection</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
