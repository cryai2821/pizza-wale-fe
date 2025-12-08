import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
      onClick={() => onAdd(product)}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-xs">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div className={cn(
            "h-4 w-4 rounded-full border-2 flex items-center justify-center bg-white",
            product.isVeg ? "border-green-600" : "border-red-600"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              product.isVeg ? "bg-green-600" : "bg-red-600"
            )} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-bold text-gray-900">₹{product.basePrice}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            onClick={() => onAdd(product)}
          >
            ADD <Plus className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
