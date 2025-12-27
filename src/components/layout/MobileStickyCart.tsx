'use client';

import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MobileStickyCart() {
    const { items, getTotal } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCheckout = () => {
        if (isAuthenticated) {
            router.push('/checkout');
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set('auth', 'login');
            params.set('redirect', '/checkout');
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    // Hide on specific pages
    const restrictedPaths = ['/checkout', '/profile'];
    if (restrictedPaths.includes(pathname)) return null;

    if (!mounted || items.length === 0) return null;

    const total = getTotal();
    const itemCount = items.length;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
            <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 text-white py-2 px-4 flex items-center justify-between shadow-emerald-200 shadow-lg active:scale-[0.98] transition-all"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-emerald-100 uppercase tracking-wide">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <span className="text-lg font-bold">
                        ₹{total}
                    </span>
                </div>

                <div className="flex items-center gap-2 font-semibold">
                    <span>View Cart</span>
                    <ArrowRight className="h-5 w-5" />
                </div>
            </button>
        </div>
    );
}
