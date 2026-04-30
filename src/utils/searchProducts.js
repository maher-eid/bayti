export function searchProducts(products, query) {
  const q = normalize(query);

  if (!q) return products;

  return products
    .map((product) => {
      const title = normalize(product.title || product.name || '');
      const category = normalize(product.category || '');
      const subcategory = normalize(product.subcategory || '');
      const description = normalize(product.description || '');
      const tags = Array.isArray(product.tags)
        ? product.tags.map(normalize).join(' ')
        : normalize(product.tags || '');

      let score = 0;

      if (title === q) score += 100;
      if (title.startsWith(q)) score += 80;
      if (title.includes(q)) score += 60;
      if (category.includes(q)) score += 40;
      if (subcategory.includes(q)) score += 40;
      if (tags.includes(q)) score += 50;
      if (description.includes(q)) score += 20;

      const words = q.split(' ').filter(Boolean);
      for (const word of words) {
        if (title.includes(word)) score += 15;
        if (category.includes(word)) score += 8;
        if (subcategory.includes(word)) score += 8;
        if (tags.includes(word)) score += 10;
        if (description.includes(word)) score += 4;
      }

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

