'use client';

import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { ArrowRight } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function MobileStickyCart() {
    const { items, getTotal } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (items.length > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 200);
            return () => clearTimeout(timer);
        }
    }, [items]); // Trigger on items change

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

    if (items.length === 0) return null;

    const total = getTotal();
    const itemCount = items.length;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pb-safe">
            <button
                onClick={handleCheckout}
                className={`group w-full bg-emerald-600 text-white h-16 rounded-2xl flex items-center justify-between px-5 shadow-2xl shadow-emerald-600/20 ring-1 ring-white/10 active:scale-[0.98] transition-all duration-200 ${isAnimating ? 'scale-[1.02] bg-emerald-700' : ''
                    }`}
            >
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">
                            ₹{total}
                        </span>
                        <span className="text-xs text-emerald-100/80 font-medium">
                            plus taxes
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-50 transition-colors">
                        View Cart
                    </span>
                    <div className="bg-white/20 rounded-full p-1.5 group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                </div>
            </button>
        </div>
    );
}
