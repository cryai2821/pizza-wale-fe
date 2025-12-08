'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { useCreateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
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

            <main className="container px-4 py-8 max-w-2xl mx-auto">
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
                            <div key={`${item.productId}-${idx}`} className="p-4 flex gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium text-gray-900">{item.product?.name || item.name}</h3>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Qty: {item.quantity} × ₹{item.price}
                                    </p>
                                    {/* Display selected options if any */}
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

                <Button
                    className="w-full h-12 text-lg"
                    onClick={handlePlaceOrder}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Placing Order...
                        </>
                    ) : (
                        `Place Order • ₹${total}`
                    )}
                </Button>
            </main>
        </div>
    );
}
