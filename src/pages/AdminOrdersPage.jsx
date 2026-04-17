import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 UPDATE STATUS
  const toggleOrderStatus = async (order) => {
    const newStatus = order.status === 'Pending' ? 'Completed' : 'Pending';

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id);

    if (error) {
      console.error(error);
      alert('Failed to update order');
    } else {
      fetchOrders(); // refresh
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1>Orders ({orders.length})</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>{order.customer_name}</td>

              <td>{order.phone}</td>

              <td>{order.items?.length || 0}</td>

              <td>${Number(order.total).toFixed(2)}</td>

              <td>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>

              <td>
                {new Date(order.created_at).toLocaleDateString()}
              </td>

              <td>
                <button
                  className="btn btn-primary"
                  style={{ marginRight: '0.5rem' }}
                  onClick={() => toggleOrderStatus(order)}
                >
                  {order.status === 'Pending' ? 'Complete' : 'Reopen'}
                </button>

                <Link
                  to={`/admin/orders/${order.id}`}
                  className="btn btn-secondary"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}