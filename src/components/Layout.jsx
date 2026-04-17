import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryBar from './CategoryBar';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <CartDrawer />
      <Outlet />
      <Footer />
    </>
  );
}
