import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const statusStyles = {
  Pending: {
    background: '#fff7ed',
    color: '#ea580c',
  },
  Confirmed: {
    background: '#eff6ff',
    color: '#2563eb',
  },
  Preparing: {
    background: '#f5f3ff',
    color: '#7c3aed',
  },
  Delivered: {
    background: '#ecfdf5',
    color: '#059669',
  },
  Cancelled: {
    background: '#fef2f2',
    color: '#dc2626',
  },
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (error) {
        console.error('Failed to fetch order:', error);
        setOrder(null);
      } else {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  const orderItems = useMemo(
    () => (Array.isArray(order?.items) ? order.items : []),
    [order]
  );

  const itemsCount = useMemo(
    () =>
      orderItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [orderItems]
  );

  const orderTotal = Number(order?.total || 0);

  if (loading) {
    return <p>Loading order...</p>;
  }

  if (!order) {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/orders" className="btn btn-secondary">
            &larr; Back to Orders
          </Link>
        </div>
        <p>Order not found.</p>
      </div>
    );
  }

  const badgeStyle = statusStyles[order.status] || {
    background: '#f3f4f6',
    color: '#374151',
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Link to="/admin/orders" className="btn btn-secondary">
            &larr; Back to Orders
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0 }}>Order #{order.id}</h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              ...badgeStyle,
            }}
          >
            {order.status || 'Unknown'}
          </span>
        </div>
      </div>

      <div
        className="order-details-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 360px) 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <div
          className="card order-info"
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: '#fff',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Customer Information</h3>

          <div style={{ display: 'grid', gap: '0.9rem' }}>
            <p style={{ margin: 0 }}>
              <strong>Name:</strong> {order.customer_name || '-'}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Phone:</strong> {order.phone || '-'}
            </p>

            <p style={{ margin: 0 }}>
              <strong>City:</strong> {order.city || '-'}
            </p>

            <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
              <strong>Address:</strong>{' '}
              {order.address ? `${order.address}${order.city ? `\n${order.city}` : ''}` : '-'}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Items:</strong> {itemsCount}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Total:</strong> ${orderTotal.toFixed(2)}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Date:</strong>{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        <div
          className="card order-items"
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: '#fff',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
            Order Items ({orderItems.length})
          </h3>

          {orderItems.length > 0 ? (
            <div style={{ display: 'grid' }}>
              {orderItems.map((item, index) => {
                const imageSrc =
                  item.image ||
                  item.main_image ||
                  (Array.isArray(item.images) ? item.images[0] : '') ||
                  '/placeholder.png';

                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const lineTotal = quantity * price;

                return (
                  <div
                    key={`${item.id || item.title || 'item'}-${index}`}
                    className="order-item"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '72px 1fr auto',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1rem 0',
                      borderBottom:
                        index === orderItems.length - 1 ? 'none' : '1px solid #eee',
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={item.title || 'Product'}
                      style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        background: '#f8f8f8',
                      }}
                    />

                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                        {item.title || 'Unnamed product'}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                        Qty: {quantity} × ${price.toFixed(2)}
                      </div>
                    </div>

                    <div style={{ fontWeight: 700 }}>
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0 }}>No order items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}