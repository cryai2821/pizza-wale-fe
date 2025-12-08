import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
    order: any;
}

export function OrderCard({ order }: OrderCardProps) {
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <Link href={`/orders/${order.id}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-transparent hover:border-emerald-100 transition-all">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.shortId}</h3>
                        <p className="text-sm text-gray-500">{date}</p>
                    </div>
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        order.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                            order.status === 'CANCELLED' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                    )}>
                        {order.status}
                    </span>
                </div>

                <div className="space-y-1 mb-3">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                        <p key={idx} className="text-sm text-gray-600 truncate">
                            {item.quantity} × {item.product.name}
                        </p>
                    ))}
                    {order.items.length > 2 && (
                        <p className="text-sm text-gray-400">+{order.items.length - 2} more items</p>
                    )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="font-semibold text-gray-900">₹{order.totalAmount}</span>
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
