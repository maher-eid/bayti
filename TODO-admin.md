# Admin Dashboard Improvements TODO

## 1. Fix data sync ✅ Gather info
- AdminDashboardPage setProducts updates StoreContext/localStorage
- sortedProducts uses products state
- Verify if bug in re-render or static override

## 2. Split admin pages (Next)
- Create AdminProductsPage.jsx (list/delete)
- AdminAddProductPage.jsx (form)
- AdminEditProductPage.jsx
- AdminOrdersPage.jsx (list)
- AdminOrderDetailsPage.jsx
- Update App.jsx routes
- Update AdminLayout nav

## 3. Image upload
- File input → base64/dataURL
- Preview thumbnails
- Multiple images array
- Store in product.images[]

## 4. Full edit form
- Prefill with current product
- Update fields incl images

## 5. Order details
- Expand placeOrder to save cart items
- Show products/images/qty in order details

## 6. UI improvements
- Cards/tables spacing
- Form UX

**Status: Planning complete - Implementing split pages & image upload**

