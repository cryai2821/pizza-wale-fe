import { Category, Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SHOP_ID = '630f4828-f130-4e8d-9038-c9e3361d43fc';

export async function getMenuServer() {
  const res = await fetch(`${API_URL}/shops/${SHOP_ID}/menu`, {
    next: { revalidate: 86400 }, // 1 Day ISR
  });

  if (!res.ok) {
    throw new Error('Failed to fetch menu');
  }

  const data = await res.json();
  
  const categories: Category[] = [];
  const products: Product[] = [];

  if (Array.isArray(data)) {
    data.forEach((cat: any) => {
      categories.push({
        id: cat.id,
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/ /g, '-'),
        imageUrl: cat.imageUrl
      });

      if (Array.isArray(cat.products)) {
        const mappedProducts = cat.products.map((p: any) => ({
          ...p,
          optionConfigs: p.optionConfigs?.map((oc: any) => ({
            ...oc,
            optionGroup: {
              ...oc.optionGroup,
              minSelection: oc.optionGroup.minSelect ?? oc.optionGroup.minSelection,
              maxSelection: oc.optionGroup.maxSelect ?? oc.optionGroup.maxSelection,
            }
          }))
        }));
        products.push(...mappedProducts);
      }
    });
  }

  return { categories, products };
}
