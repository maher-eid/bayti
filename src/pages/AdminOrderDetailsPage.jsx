import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch order:', error);
      } else {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  const orderItems = order.items || [];

  return (
    <div>
      <h1>Order #{order.id}</h1>

      <div className="order-details-grid">
        <div className="order-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {order.customer_name}</p>
          <p><strong>Phone:</strong> {order.phone}</p>

          {order.address && (
            <p>
              <strong>Address:</strong> {order.address}
              {order.city ? `, ${order.city}` : ''}
            </p>
          )}

          <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${String(order.status).toLowerCase()}`}>
              {order.status}
            </span>
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : 'N/A'}
          </p>
        </div>

        <div className="order-items">
          <h3>Order Items ({orderItems.length})</h3>

          {orderItems.length > 0 ? (
            orderItems.map((item, i) => (
              <div
                key={i}
                className="order-item"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <img
                  src={item.image || item.main_image}
                  alt={item.title}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div>
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div style={{ fontWeight: 'bold' }}>
                  ${(Number(item.quantity) * Number(item.price)).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p>No order items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}