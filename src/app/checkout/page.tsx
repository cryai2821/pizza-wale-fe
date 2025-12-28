'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { useCreateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Loader2, Trash2, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart, removeItem, updateQuantity } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const { mutate: createOrder, isPending } = useCreateOrder();

    const total = getTotal();
    const shopId = process.env.NEXT_PUBLIC_SHOP_ID || '630f4828-f130-4e8d-9038-c9e3361d43fc';

    const handlePlaceOrder = () => {
        if (!user) return;

        const orderData = {
            shopId,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                options: item.selectedOptions.map(opt => ({ optionId: opt.optionId }))
            }))
        };

        createOrder(orderData, {
            onSuccess: (data) => {
                clearCart();
                router.push(`/orders/${data.id}`);
            },
            onError: (error) => {
                console.error('Failed to place order:', error);
                alert('Failed to place order. Please try again.');
            }
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in to checkout.</p>
                    <Link href="/">
                        <Button>Back to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <Link href="/">
                        <Button>Browse Menu</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container px-4 py-8 max-w-2xl mx-auto pb-32">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Order Summary</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {items.map((item, idx) => (
                            <div key={`${item.productId}-${idx}`} className="p-4 flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-start gap-2">
                                        {/* Veg/Non-veg icon placeholder - would go here */}
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.product?.name || item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {item.selectedOptions && item.selectedOptions.length > 0
                                                    ? item.selectedOptions.map(opt => opt.name).join(', ')
                                                    : 'Regular'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center rounded-lg border border-gray-200 h-8">
                                        <button
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    updateQuantity(item.productId, item.selectedOptions, item.quantity - 1);
                                                } else {
                                                    removeItem(item.productId, item.selectedOptions);
                                                }
                                            }}
                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors rounded-l-lg"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.selectedOptions, item.quantity + 1)}
                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-emerald-600 transition-colors rounded-r-lg"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Taxes & Fees</span>
                            <span>₹0</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Contact Details</h2>
                    <p className="text-gray-600">{user?.phone}</p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-2xl mx-auto">
                        <Button
                            className="w-full h-14 text-lg font-semibold shadow-lg shadow-emerald-500/20"
                            onClick={handlePlaceOrder}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                <div className="flex items-center justify-between w-full px-2">
                                    <span>Place Order</span>
                                    <span>₹{total}</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
