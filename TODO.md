# Checkout Page Enhancements TODO

## Steps:
- [x] Step 1: Create TODO.md with plan breakdown
- [x] Step 2: Edit src/pages/CheckoutPage.jsx to add agreement text after notes section
- [x] Step 3: Edit src/pages/CheckoutPage.jsx to add small product images to order summary  
- [x] Step 4: Update TODO.md with completion status
- [x] Step 5: Test changes and attempt_completion

## Status: ✅ Cart page row layout and Checkout page enhancements complete!
**Changes made:**
- **CheckoutPage.jsx**: Added agreement text after notes textarea. Order summary now shows small main images (50x50px) on left with title, qty, subtotal on right in clean flex layout.
- **CartPage.jsx**: Converted from grid cards to horizontal row layout (Amazon-style). Each item is a flex row with image, info (title, price, qty controls), and actions (subtotal, remove).
- **global.css**: Added `.cart-item` row classes, `.cart-qty`, `.remove-btn`, `.cart-subtotal`, `.cart-price` styles with mobile responsiveness.
**Logic preserved**: Quantity update, remove, and dynamic pricing all still work.
To test: Add items to cart, go to /cart and /checkout. Use `npm run dev` if dev server not running.

