import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function SocialFloatingButtons() {
  return (
    <div className="social-floating-container">
      {/* Instagram — top */}
      <a
        href="https://www.instagram.com/baytilebnani"
        className="social-floating-btn social-floating-instagram"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <FaInstagram size={22} />
      </a>

      {/* WhatsApp — bottom */}
      <a
        href="https://wa.me/96176545166"
        className="social-floating-btn social-floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  );
}
