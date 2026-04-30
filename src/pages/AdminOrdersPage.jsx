import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const statuses = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Pending': return { backgroundColor: '#fed7aa', color: '#c2410c' };
    case 'Confirmed': return { backgroundColor: '#93c5fd', color: '#1e40af' };
    case 'Preparing': return { backgroundColor: '#ddd6fe', color: '#7c3aed' };
    case 'Delivered': return { backgroundColor: '#bbf7d0', color: '#166534' };
    case 'Cancelled': return { backgroundColor: '#fecaca', color: '#dc2626' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update order status');
      } else {
        await fetchOrders(); // Refresh list
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Orders ({orders.length})</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb' 
        }}>
          <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: '#9ca3af' }}>Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Customer Name</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Phone</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>City</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Items Count</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    #{order.id}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 500 }}>
                    {order.customer_name || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {order.phone || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {order.city || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>
                    {order.items?.length || 0}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 600, color: '#059669' }}>
                    ${Number(order.total || 0).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span 
                      style={{
                        ...getStatusBadgeStyle(order.status),
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}
                    >
                      {order.status || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: '#6b7280' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <select
                        value={order.status || ''}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          backgroundColor: updatingOrderId === order.id ? '#f3f4f6' : 'white',
                          cursor: updatingOrderId === order.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="btn btn-secondary"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
