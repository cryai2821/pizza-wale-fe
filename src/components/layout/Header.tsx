'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { useUIStore } from '@/lib/store/ui';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';

export function Header() {
  const { items, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useUIStore();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">Pizza Wale</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-emerald-600">Menu</Link>
              <Link href="/orders" className="transition-colors hover:text-emerald-600">My Orders</Link>
            </nav>

            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.phone}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                className="hidden md:inline-flex"
                onClick={openAuthModal}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
      <CartDrawer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
