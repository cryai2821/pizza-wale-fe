import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category, Product } from '@/types';

const SHOP_ID = '630f4828-f130-4e8d-9038-c9e3361d43fc'; // Hardcoded for now

interface MenuData {
  categories: Category[];
  products: Product[];
}

export function useMenu() {
  return useQuery({
    queryKey: ['menu', SHOP_ID],
    queryFn: async (): Promise<MenuData> => {
      const { data } = await api.get(`/shops/${SHOP_ID}/menu`);
      
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
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
