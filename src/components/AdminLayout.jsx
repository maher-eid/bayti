import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AdminLayout() {
  const { adminLoggedIn, setAdminLoggedIn } = useStore();

  if (!adminLoggedIn) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 2rem 2rem' }}>
          <h3>Bayti Lebnani Admin</h3>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
          <button className="btn btn-danger" style={{ margin: '1rem 2rem', width: 'auto' }} onClick={() => setAdminLoggedIn(false)}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
