'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.productId, item.selectedOptions);
    } else {
      updateQuantity(item.productId, item.selectedOptions, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 bg-white rounded-lg shadow-sm p-3 mb-3">
      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <div className="text-sm text-gray-500 space-y-0.5">
          {item.selectedOptions.map((opt, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{opt.name}</span>
              {opt.price > 0 && <span>+₹{opt.price}</span>}
            </div>
          ))}
        </div>
        <div className="font-medium text-gray-900 pt-1">
          ₹{item.totalPrice * item.quantity}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => removeItem(item.productId, item.selectedOptions)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center rounded-lg shadow-sm bg-gray-50">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-1.5 hover:bg-gray-100 text-emerald-600 rounded-l-lg"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-1.5 hover:bg-gray-100 text-emerald-600 rounded-r-lg"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
