'use client';

import { useState } from 'react';
import { Category, Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { CustomizationModal } from '@/components/product/CustomizationModal';
import { useCartStore } from '@/lib/store/cart';

import { useMenu } from '@/hooks/useMenu';

export function MenuSection() {
  const { data, isLoading, error } = useMenu();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addItem } = useCartStore();

  const handleProductClick = (product: Product) => {
    if (product.optionConfigs && product.optionConfigs.length > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      // Add directly to cart if no options
      addItem({
        productId: product.id,
        product: {
          name: product.name
        },
        name: product.name,
        basePrice: product.basePrice,
        quantity: 1,
        price: product.basePrice,
        selectedOptions: [],
        totalPrice: product.basePrice
      });
    }
  };

  const handleAddToCart = (item: any) => {
    addItem(item);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        Failed to load menu. Please try again later.
      </div>
    );
  }

  const { categories = [], products = [] } = data || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container px-4 py-6 space-y-8">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id);

          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} id={category.slug} className="scroll-mt-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleProductClick}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p>No items found.</p>
          </div>
        )}
      </div>

      <CustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
