import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryBar from './CategoryBar';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SocialFloatingButtons from './SocialFloatingButtons';

export default function Layout() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <CartDrawer />
      <div style={{ animation: 'pageIn 0.6s ease-in-out' }}>
        <Outlet />
      </div>
      <SocialFloatingButtons />
      <Footer />
    </>
  );
}
