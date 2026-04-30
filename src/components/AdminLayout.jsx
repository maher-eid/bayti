import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 2rem 2rem' }}>
          <h3>Bayti Lebnani Admin</h3>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Orders
          </NavLink>

          <button
            className="btn btn-danger"
            style={{ margin: '1rem 2rem', width: 'auto' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}