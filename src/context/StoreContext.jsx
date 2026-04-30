import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('cart', []);
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [isCartOpen, setIsCartOpen] = useLocalStorage('isCartOpen', false);
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [selectedCategory, setSelectedCategory] = useLocalStorage('selectedCategory', '');
  const [priceFilter, setPriceFilter] = useLocalStorage('priceFilter', 'all');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'name');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const addToCart = (product) => {
    const maxStock = product.stock_quantity ?? Infinity;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const newQty = existing ? existing.quantity + 1 : 1;

      if (newQty > maxStock) {
        alert(`Cannot add more. Only ${maxStock} left for ${product.title}.`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((itemId) => itemId !== id)
        : [...prevWishlist, id]
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async (form) => {
    const items = cart.map((item) => ({
      product_id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      console.log('placeOrder: Starting fetch to create-order-with-stock');
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order-with-stock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            customer_name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city || '',
            items,
          }),
          signal: controller.signal,
        }
      );

      console.log('placeOrder: Fetch completed, response status:', response.status);
      const rawText = await response.text();
      console.log('placeOrder: Raw response text:', rawText);

      let result = null;

      try {
        result = rawText ? JSON.parse(rawText) : null;
        console.log('placeOrder: Parsed JSON result:', result);
      } catch (parseError) {
        console.error('placeOrder: JSON parse error:', parseError);
        result = { error: rawText || 'Invalid server response' };
      }

      if (!response.ok) {
        console.error('placeOrder: Response not ok, throwing error:', result?.error || 'Failed to place order');
        throw new Error(result?.error || 'Failed to place order');
      }

      if (!result?.order) {
        console.error('placeOrder: No order in result, result:', result);
        throw new Error('Order was created, but no order data was returned');
      }

      console.log('placeOrder: Returning order:', result.order);
      setCart([]);
      return result.order;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceFilter('all');
    setSortBy('name');
  };

  const openFilterDrawer = () => setIsFilterDrawerOpen(true);
  const closeFilterDrawer = () => setIsFilterDrawerOpen(false);

  const value = {
    cart,
    cartTotal,
    wishlist,
    isCartOpen,
    isFilterDrawerOpen,
    searchTerm,
    selectedCategory,
    priceFilter,
    sortBy,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    closeCart,
    openFilterDrawer,
    closeFilterDrawer,
    toggleWishlist,
    placeOrder,
    setSearchTerm,
    setSelectedCategory,
    setPriceFilter,
    setSortBy,
    clearFilters,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}