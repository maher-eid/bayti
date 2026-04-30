import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackOrderPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_FUNCTION_URL = supabaseUrl
    ? `${supabaseUrl}/functions/v1`
    : '';

  const handleLookup = async (e) => {
    e.preventDefault();

    const trimmedToken = token.trim();

    if (!trimmedToken) {
      setError('Please enter your order lookup token');
      return;
    }

    if (!SUPABASE_FUNCTION_URL) {
      setError('Missing Supabase configuration');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${SUPABASE_FUNCTION_URL}/order-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lookup_token: trimmedToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Order lookup failed');
      }

      if (result.order) {
        navigate('/order-details', {
          state: {
            order: result.order,
            cancelToken: result.order.cancel_token,
          },
        });
        return;
      }

      setError('Order not found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#1f2937',
        }}
      >
        Track Your Order
      </h1>

      <form
        onSubmit={handleLookup}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label
            style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
          >
            Order Lookup Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your 32-character lookup token"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
            disabled={loading}
          />
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.25rem',
            }}
          >
            Find your lookup token in your order confirmation email or receipt.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}
          >
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !token.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Looking up order...' : 'Track Order'}
        </button>
      </form>
    </div>
  );
}