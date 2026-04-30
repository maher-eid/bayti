import { FaWhatsapp, FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* CONTACT */}
        <div className="footer-section">
          <h3>Get in Touch</h3>

          <p className="footer-item">
            <FaWhatsapp /> 
            <a href="https://wa.me/96176545166" target="_blank" rel="noopener noreferrer">
              +961 76 545 166
            </a>
          </p>

          <p className="footer-item">
            <FaEnvelope /> 
            <a href="mailto:hello@baytilebnani.com">
              hello@.com
            </a>
          </p>
ye
          {/* SOCIALS */}
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/wishlist">Wishlist</a>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Bayti Lebnani. Powered by Maher Eid.
      </div>
    </footer>
  );
}