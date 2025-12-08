import { Category, Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SHOP_ID = '630f4828-f130-4e8d-9038-c9e3361d43fc'; // Hardcoded for now as per user context

export async function getMenu() {
  try {
    const res = await fetch(`${API_URL}/shops/${SHOP_ID}/menu`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch menu');
    }

    const data = await res.json();
    
    // Transform the nested response (Category[]) into { categories, products }
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
          products.push(...cat.products);
        }
      });
    }

    return { categories, products };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { categories: [], products: [] };
  }
}
