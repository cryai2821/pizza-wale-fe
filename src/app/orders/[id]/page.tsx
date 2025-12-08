'use client';

import { useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrders';
import { Header } from '@/components/layout/Header';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const { data: order, isLoading } = useOrder(params.id as string);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
                    <Link href="/orders">
                        <Button variant="outline">Back to Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const date = new Date(order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container px-4 py-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Order #{order.shortId}</h1>
                        <p className="text-sm text-gray-500">{date}</p>
                    </div>
                </div>

                {/* Status Stepper */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
                    <OrderStatus status={order.status} />
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Items</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="p-4">
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-medium text-gray-900">
                                        {item.quantity} × {item.product?.name || 'Product'}
                                    </h3>
                                    <span className="font-medium">₹{item.price * item.quantity}</span>
                                </div>
                                {item.selectedOptions?.map((opt: any) => (
                                    <p key={opt.id} className="text-sm text-gray-500 ml-4">
                                        + {opt.option.name} (₹{opt.price})
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                        <span>Total Amount</span>
                        <span>₹{order.totalAmount}</span>
                    </div>
                </div>

                {/* Delivery/Pickup Info (Placeholder) */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Store Pickup</p>
                                <p className="text-gray-500">{order.shop?.name || 'Pizza Wale Store'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Contact</p>
                                <p className="text-gray-500">{order.guestPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
