import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cart";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { items, updateQuantity, removeItem } = useCartStore();

  const cartItems = items.filter((item) => item.productId === product.id);
  const quantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItems.length === 0) return;

    // Remove logic: LIFO (Last Added Variant First Out) or just decrement quantity of last one
    const lastItem = cartItems[cartItems.length - 1];

    if (lastItem.quantity > 1) {
      updateQuantity(
        lastItem.productId,
        lastItem.selectedOptions,
        lastItem.quantity - 1
      );
    } else {
      removeItem(lastItem.productId, lastItem.selectedOptions);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
  };

  return (
    <div
      className="group relative flex flex-row overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 p-3 gap-3 transition-all hover:shadow-md h-[180px]"
      onClick={() => onAdd(product)}
    >
      {/* Left Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          {/* Veg/Non-Veg Icon */}
          <div
            className="h-4 w-4 bg-white rounded-sm border border-green-600 flex items-center justify-center p-0.5"
            title="Vegetarian"
          >
            <div className="h-full w-full rounded-full bg-green-600" />
          </div>

          <h3 className="font-bold text-gray-900 line-clamp-2 text-base leading-tight">
            {product.name}
          </h3>

          <div className="font-bold text-gray-900">₹{product.basePrice}</div>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Right Image & Action */}
      <div className="relative w-[40%] min-w-[140px] h-full rounded-lg overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gray-50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90px] shadow-lg shadow-black/10 z-10">
          {quantity > 0 ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center w-full bg-emerald-700/90 rounded-lg shadow-sm border border-emerald-600/20 overflow-hidden h-9 backdrop-blur-sm">
                <button
                  onClick={handleDecrement}
                  className="flex-1 h-full text-white hover:bg-emerald-800 transition-colors flex items-center justify-center active:bg-emerald-900"
                >
                  <Minus className="h-3.5 w-3.5 font-bold stroke-3" />
                </button>
                <span className="text-sm font-bold text-white px-1 text-center min-w-5 select-none">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="flex-1 h-full text-white hover:bg-emerald-800 transition-colors flex items-center justify-center active:bg-emerald-900"
                >
                  <Plus className="h-3.5 w-3.5 font-bold stroke-3" />
                </button>
              </div>
              {product.optionConfigs && product.optionConfigs.length > 0 && (
                <span className="text-[9px] text-gray-500 font-medium mt-1 bg-white/90 px-1 rounded shadow-sm">
                  Customisable
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9 px-0 text-emerald-600 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 font-bold uppercase text-xs tracking-wide bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(product);
                }}
              >
                ADD
              </Button>
              {product.optionConfigs && product.optionConfigs.length > 0 && (
                <span className="text-[9px] text-gray-400 font-medium mt-1 bg-white/80 px-1 rounded">
                  Customisable
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
