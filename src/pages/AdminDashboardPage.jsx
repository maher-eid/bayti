import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminDashboardPage() {
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // PRODUCTS COUNT
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setProductsCount(count || 0);

      // ORDERS
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*');

      setOrders(ordersData || []);

    } catch (err) {
      console.error('Dashboard error:', err);
    }
  };

  return (
    <div>
      <h1>Dashboard Overview</h1>

      <div className="summary-cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        
        <div className="summary-card card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3>{productsCount}</h3>
          <p>Total Products</p>
        </div>

        <div className="summary-card card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>

        <div className="summary-card card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3>{orders.filter(o => o.status === 'Pending').length}</h3>
          <p>Pending Orders</p>
        </div>

        <div className="summary-card card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3>
            ${orders.reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}
          </h3>
          <p>Revenue</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        
        <Link to="/admin/products" className="card" style={{textDecoration: 'none', textAlign: 'center', padding: '2rem'}}>
          <h3>Manage Products</h3>
          <p>Add, edit, delete products</p>
        </Link>

        <Link to="/admin/orders" className="card" style={{textDecoration: 'none', textAlign: 'center', padding: '2rem'}}>
          <h3>Manage Orders</h3>
          <p>View orders and update status</p>
        </Link>
      </div>
    </div>
  );
}