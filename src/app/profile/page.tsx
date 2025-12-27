'use client';

import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/Button';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) {
        return (
            <>
                <Header />
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Please login to view your profile</h2>
                        <Link href="/">
                            <Button>Go Home</Button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Menu
                        </Link>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white shadow-lg mb-4">
                                <User className="h-12 w-12 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">My Profile</h2>
                        </div>

                        <div className="px-6 py-8 space-y-8">
                            {/* User Details */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                        Phone Number
                                    </label>
                                    <p className="text-lg font-medium text-gray-900 flex items-center">
                                        {user.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-100">
                                <Button
                                    variant="danger"
                                    className="w-full h-12 text-base shadow-sm hover:shadow-md transition-all"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
