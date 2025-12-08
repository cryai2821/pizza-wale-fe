import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedOptions: CartItem['selectedOptions']) => void;
  updateQuantity: (productId: string, selectedOptions: CartItem['selectedOptions'], quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          // Check if item with same ID and options exists
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.productId === newItem.productId && 
              JSON.stringify(item.selectedOptions) === JSON.stringify(newItem.selectedOptions)
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems, isOpen: true };
          }

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (productId, selectedOptions) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              !(item.productId === productId && 
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
          ),
        }));
      },

      updateQuantity: (productId, selectedOptions, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.productId === productId && 
              JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
      },
    }),
    {
      name: 'pizza-wale-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
