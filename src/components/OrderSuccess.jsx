import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccess({ show, orderId, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';

      // Auto-dismiss after 7s
      const timer = setTimeout(() => {
        onClose();
        navigate('/');
      }, 7000);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [show, onClose, navigate]);

  if (!show) return null;

  return (
    <div className="order-success-fullscreen">
      <div className="order-success-backdrop" />
      <div className="order-success-content">
        <div className="order-success-graphic">
          <svg viewBox="0 0 120 120" className="checkmark-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#D2B48C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <animate
                attributeName="stroke-dasharray"
                values="0, 314; 157, 157; 314, 0"
                dur="1.2s"
                fill="freeze"
              />
            </circle>
            <path d="M 34 60 L 50 75 L 86 39" fill="none" stroke="#D2B48C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <animate
                attributeName="stroke-dasharray"
                values="0, 70; 35, 35; 70, 0"
                dur="0.8s"
                begin="1.2s"
                fill="freeze"
              />
            </path>
            <circle cx="60" cy="60" r="4" fill="#D2B48C">
              <animate
                attributeName="r"
                values="0; 6; 4; 5; 4"
                dur="1s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <div className="order-success-text">
          <h1 className="success-title">Thank You for Your Trust 🤍</h1>
          <p className="success-subtitle">Your order has been successfully placed.</p>
          {orderId && (
            <p className="order-id">
              Order ID: <span className="order-id-number">#{orderId}</span>
            </p>
          )}
          <p className="delivery-info">
            Your order will arrive within <span className="highlight">4–5 business days</span>.
          </p>
        </div>
        <button className="success-cta" onClick={() => { onClose(); navigate('/'); }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
