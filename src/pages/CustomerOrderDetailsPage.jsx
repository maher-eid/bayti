import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function CustomerOrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const location = useLocation();

  const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL.replace(/\/api$/, '') + '/functions/v1';

  const { state } = location;
  const cancelToken = state?.cancelToken;

  useEffect(() => {
    if (state?.order) {
      setOrder(state.order);
    } else {
      setError('Order not found. Please go back and lookup your order again.');
    }
  }, [state]);

  const handleCancelOrder = async () => {
    if (!cancelToken) {
      setError('Cancel token not available');
      return;
    }

    setCancelLoading(true);
    setError('');

    try {
      const response = await fetch(`${SUPABASE_FUNCTION_URL}/order-cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancel_token: cancelToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Cancel failed');
      }

      // Update local state with cancelled order
      setOrder(result.order);
      alert('Order cancelled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const canCancel = order && ['Pending', 'Confirmed'].includes(order.status);

  if (error && !order) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '2rem', 
        textAlign: 'center',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Order Not Found</h2>
        <p>{error}</p>
        <Link 
          to="/track-order" 
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          Track Another Order
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading order details...
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f97316';
      case 'Confirmed': return '#3b82f6'; 
      case 'Preparing': return '#8b5cf6';
      case 'Delivered': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      background: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white' 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Order #{order.id}</h1>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '20px',
            fontSize: '0.875rem'
          }}>
            Status: <strong>{order.status}</strong>
          </span>
          <span style={{ fontSize: '0.875rem' }}>
            Placed: {new Date(order.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Customer Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>Name:</strong> {order.customer_name || 'N/A'}
          </div>
          <div>
            <strong>Phone:</strong> {order.phone || 'N/A'}
          </div>
          <div>
            <strong>City:</strong> {order.city || 'N/A'}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <strong>Address:</strong> {order.address || 'N/A'}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={{ padding: '0 2rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Order Items</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '1rem', 
                padding: '1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                alignItems: 'center'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : 'Image'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{item.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                    Qty: {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <div style={{ fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
                  ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No items in this order</p>
          )}
        </div>

        {/* Total */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.25rem',
          fontWeight: 700
        }}>
          <span>Total:</span>
          <span style={{ color: '#059669' }}>
            ${Number(order.total || 0).toLocaleString('en-US', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ 
        padding: '2rem', 
        borderTop: '1px solid #e5e7eb', 
        backgroundColor: '#f9fafb' 
      }}>
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelLoading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: cancelLoading ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: cancelLoading ? 'not-allowed' : 'pointer',
              marginRight: '1rem'
            }}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}

        {!canCancel && order.status !== 'Cancelled' && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            color: '#166534',
            marginBottom: '1rem'
          }}>
            This order cannot be cancelled (Status: {order.status})
          </div>
        )}

        {order.status === 'Cancelled' && order.cancelled_at && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626'
          }}>
            ✅ Order cancelled by {order.cancelled_by || 'customer'} on {new Date(order.cancelled_at).toLocaleDateString('en-US')}
          </div>
        )}

        <Link
          to="/track-order"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#6b7280',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          Track Another Order
        </Link>
      </div>
    </div>
  );
}
