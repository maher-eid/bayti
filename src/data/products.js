export const categories = [
  {
    slug: 'appliance',
    name: 'Appliances',
    image: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Blenders', 'Microwaves', 'Coffee Machines']
  },
  {
    slug: 'health-beauty',
    name: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Skin Care', 'Hair Care', 'Self Care']
  },
  {
    slug: 'home-decor',
    name: 'Home & Decor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Vases', 'Candles', 'Frames']
  },
  {
    slug: 'house-ware',
    name: 'Houseware',
    image: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Cleaning Tools', 'Laundry', 'Essentials']
  },
  {
    slug: 'kitchen',
    name: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Cookware', 'Utensils', 'Storage']
  },
  {
    slug: 'organizers',
    name: 'Organizers & Storage',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Boxes', 'Shelves', 'Baskets']
  },
  {
    slug: 'table-ware',
    name: 'Tableware',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Plates', 'Cups', 'Serving']
  }
];

export const initialProducts = [
  { id: 1, title: 'Ceramic Vase Set', description: 'Handcrafted Lebanese ceramics.', price: 89.99, category: 'table-ware', image: 'https://images.unsplash.com/photo-1528900662329-c7553b7f1f15?w=400', hasOptions: true },
  { id: 2, title: 'Professional Blender', description: 'High-speed blender for smoothies.', price: 189.99, category: 'appliance', image: 'https://images.unsplash.com/photo-1570795043131-8e7de6f5f1fd?w=400', hasOptions: false },
  { id: 3, title: 'Microwave Oven', description: 'Compact 900W microwave.', price: 129.99, category: 'appliance', image: 'https://images.unsplash.com/photo-1592851620544-6e4ca16b21bd?w=400', hasOptions: false },
  { id: 4, title: 'Coffee Maker', description: '12-cup programmable brewer.', price: 89.99, category: 'appliance', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', hasOptions: true },
  { id: 5, title: 'Rose Water Mist', description: 'Organic Lebanese rose mist toner.', price: 34.99, category: 'health-beauty', image: 'https://images.unsplash.com/photo-1578633343368-735dd11f49cf?w=400', hasOptions: false },
  { id: 6, title: 'Argan Oil Serum', description: 'Pure nourishing argan oil.', price: 49.99, category: 'health-beauty', image: 'https://images.unsplash.com/photo-1581924673888-c84ce7f8d933?w=400', hasOptions: false },
  { id: 7, title: 'Oud Perfume', description: 'Luxury oud fragrance oil.', price: 89.99, category: 'health-beauty', image: 'https://images.unsplash.com/photo-1610981654759-946398d176cd?w=400', hasOptions: false },
  { id: 8, title: 'Decor Candle Set', description: 'Warm cozy candles for elegant homes.', price: 29.99, category: 'home-decor', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', hasOptions: false },
  { id: 9, title: 'Modern Wall Frame', description: 'Minimal photo frame set.', price: 39.99, category: 'home-decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400', hasOptions: false },
  { id: 10, title: 'Laundry Basket', description: 'Woven seagrass hamper.', price: 39.99, category: 'house-ware', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', hasOptions: false },
  { id: 11, title: 'Ceramic Cleaning Set', description: 'Patterned cleaning brushes.', price: 24.99, category: 'house-ware', image: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400', hasOptions: false },
  { id: 12, title: 'Copper Cookware Set', description: 'Authentic Lebanese copper pots.', price: 299.99, category: 'kitchen', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', hasOptions: true },
  { id: 13, title: 'Olive Wood Utensils', description: 'Handcrafted serving spoons.', price: 45.99, category: 'kitchen', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', hasOptions: false },
  { id: 14, title: 'Coffee Mug Set', description: 'Premium ceramic mugs.', price: 34.99, category: 'kitchen', image: 'https://images.unsplash.com/photo-1570784332178-f6a8c299d7de?w=400', hasOptions: false },
  { id: 15, title: 'Beige Storage Bins', description: 'Stackable fabric organizers.', price: 29.99, category: 'organizers', image: 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?w=400', hasOptions: false },
  { id: 16, title: 'Woven Basket Set', description: 'Natural baskets for cozy storage.', price: 54.99, category: 'organizers', image: 'https://images.unsplash.com/photo-1616627455628-3df0c0a5f0d5?w=400', hasOptions: false },
  { id: 17, title: 'Brass Tea Glasses', description: 'Traditional Lebanese tea glasses.', price: 59.99, category: 'table-ware', image: 'https://images.unsplash.com/photo-1570784332178-f6a8c299d7de?w=400', hasOptions: false },
  { id: 18, title: 'Ceramic Dinner Plates', description: '12-piece Lebanese pattern set.', price: 149.99, category: 'table-ware', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', hasOptions: false }
];

export const initialOrders = [
  { id: 1001, customerName: 'Maya Haddad', phone: '+961 70 000 001', items: 3, total: '269.97', status: 'Pending', date: '2026-04-01' },
  { id: 1002, customerName: 'Karim Nassar', phone: '+961 70 000 002', items: 2, total: '184.98', status: 'Completed', date: '2026-04-03' }
];

