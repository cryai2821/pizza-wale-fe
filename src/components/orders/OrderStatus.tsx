import { CheckCircle2, Clock, ChefHat, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusProps {
    status: string;
}

const steps = [
    { id: 'PENDING', label: 'Pending', icon: Clock },
    { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { id: 'READY', label: 'Ready', icon: Package },
    { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
];

export function OrderStatus({ status }: OrderStatusProps) {
    const currentStepIndex = steps.findIndex(s => s.id === status);
    const isCancelled = status === 'CANCELLED';

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <span className="font-medium">Order Cancelled</span>
            </div>
        );
    }

    return (
        <div className="w-full py-4">
            <div className="relative flex justify-between">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-5 left-0 h-1 bg-emerald-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                    isActive
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "bg-white border-gray-300 text-gray-400"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors",
                                    isActive ? "text-emerald-700" : "text-gray-400",
                                    isCurrent && "font-bold"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
