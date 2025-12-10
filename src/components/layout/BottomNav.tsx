'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, Pizza } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';

export function BottomNav() {
  const pathname = usePathname();
  const { toggleCart, items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '#menu', label: 'Menu', icon: Pizza },
    { href: '#cart', label: 'Cart', icon: ShoppingBag, onClick: toggleCart },
    { href: '#profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon, onClick }) => {
          const isActive = pathname === href;
          return (
            <button
              key={label}
              onClick={onClick ? onClick : () => {}}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors w-full h-full',
                isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {onClick ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {label === 'Cart' && itemCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="mt-1">{label}</span>
                </div>
              ) : (
                <Link href={href} className="flex flex-col items-center justify-center w-full h-full">
                  <Icon className="h-5 w-5" />
                  <span className="mt-1">{label}</span>
                </Link>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
