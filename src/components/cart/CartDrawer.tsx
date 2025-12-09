'use client';

import { useCartStore } from '@/lib/store/cart';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CartItem } from './CartItem';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useUIStore } from '@/lib/store/ui';

export function CartDrawer() {
  const { items, isOpen, toggleCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUIStore();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      openAuthModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={toggleCart}
      title={`Your Cart (${items.length})`}
      className="sm:max-w-md z-999"
    >
      {items.length === 0 ? (
        /* Empty State */
        <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500 px-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-1">Add some delicious items to get started!</p>
        </div>
      ) : (
        <>
          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[calc(95vh-280px)] sm:max-h-[calc(90vh-280px)]">
            <div className="space-y-3 pb-4">
              {items.map((item, idx) => (
                <CartItem key={`${item.productId}-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Checkout Footer - Always Visible */}
          <div className="shrink-0 border-t bg-gradient-to-b from-white to-gray-50 px-6 py-4 sticky bottom-0">
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-medium">₹{getTotal()}</span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-600">₹{getTotal()}</span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
