'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Category, Product } from '@/types';
import { useCartStore } from '@/lib/store/cart';
import { usePathname } from 'next/navigation';

interface MobileFloatingMenuProps {
    categories: Category[];
    products: Product[];
}

export function MobileFloatingMenu({ categories, products }: MobileFloatingMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { items } = useCartStore();
    const hasCartItems = items.length > 0;

    // Position: Lower (bottom-6) if no cart, Higher (bottom-24) if cart exists
    const positionClass = hasCartItems ? 'bottom-22' : 'bottom-6';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const scrollToCategory = (slug: string) => {
        // ... rest of function
        setIsOpen(false);
        const element = document.getElementById(slug);
        if (element) {
            const headerOffset = 195;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const getCategoryCount = (categoryId: string) => {
        return products.filter(p => p.categoryId === categoryId).length;
    };

    const pathname = usePathname();
    const restrictedPaths = ['/checkout', '/profile'];

    if (restrictedPaths.includes(pathname)) return null;
    if (!categories || categories.length === 0) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-99 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Floating Menu Container */}
            <div className={`fixed ${positionClass} right-4 z-100 md:hidden flex flex-col items-end gap-2 pointer-events-none transition-all duration-300`}>

                {/* Menu List Popover */}
                <div
                    className={`
            bg-white rounded-2xl shadow-xl w-64 overflow-hidden outline outline-gray-100
            transition-all duration-200 origin-bottom-right pointer-events-auto
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
          `}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-100">
                        <span className="font-semibold text-emerald-600">Menu</span>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-[45vh] overflow-y-auto py-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => scrollToCategory(category.slug)}
                                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                            >
                                <span className="text-sm text-gray-700 font-medium group-hover:text-emerald-600 transition-colors truncate pr-2">
                                    {category.name}
                                </span>
                                <span className="text-xs text-gray-400 font-medium shrink-0 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    {getCategoryCount(category.id)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggle Button */}
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0 pointer-events-auto transition-all duration-200
            ${isOpen ? 'bg-gray-900 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'}
          `}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                            <Menu className="h-6 w-6 text-white" />
                            <span className="text-[10px] font-medium text-white">Menu</span>
                        </div>
                    )}
                </Button>
            </div>
        </>
    );
}
