'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useMyOrders } from '@/hooks/useOrders';
import { Header } from '@/components/layout/Header';
import { OrderCard } from '@/components/orders/OrderCard';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MyOrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { data: orders, isLoading } = useMyOrders();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container px-4 py-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    </div>
                ) : orders?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Link href="/">
                            <Button>Browse Menu</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders?.map((order: any) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
