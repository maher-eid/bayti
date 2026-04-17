import { createContext, useContext, useMemo, useState } from 'react';
import { initialOrders, initialProducts } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useLocalStorage('products', initialProducts);
  const [cart, setCart] = useLocalStorage('cart', []);
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [orders, setOrders] = useLocalStorage('orders', initialOrders);
  const [adminLoggedIn, setAdminLoggedIn] = useLocalStorage('adminLoggedIn', false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, change) => {
    setCart((current) => current
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  const placeOrder = (customer) => {
    const newOrder = {
      id: Date.now(),
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      city: customer.city || '',
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      })),
      cartCount,
      total: cartTotal.toFixed(2),
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10)
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    return newOrder;
  };

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((product) => 
        [product.title, product.description, product.category].some((text) => text.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return result;
  }, [products, searchTerm, sortBy]);

  const value = {
    products,
    sortedProducts,
    setProducts,
    cart,
    wishlist,
    orders,
    setOrders,
    cartCount,
    cartTotal,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    adminLoggedIn,
    setAdminLoggedIn,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    placeOrder
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
