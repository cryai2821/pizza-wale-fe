'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (item: any) => void;
}

export function CustomizationModal({ isOpen, onClose, product, onAddToCart }: CustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Reset state when product changes
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      // Pre-select default options if needed (e.g., Regular size)
      const initialOptions: Record<string, string[]> = {};

      product.optionConfigs?.forEach(config => {
        const group = config.optionGroup;
        // If it's a required single selection (like Size), select the first one (usually Regular)
        if (group.minSelection === 1 && group.maxSelection === 1) {
          // Try to find "Regular" or just pick the first
          const defaultOption = group.options.find(o => o.name.toLowerCase().includes('regular')) || group.options[0];
          if (defaultOption) {
            initialOptions[group.id] = [defaultOption.id];
          }
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [isOpen, product]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    let total = Number(product.basePrice); // Explicit formatting to avoid string concatenation

    product.optionConfigs?.forEach(config => {
      const group = config.optionGroup;
      const selectedIds = selectedOptions[group.id] || [];

      selectedIds.forEach(optId => {
        const option = group.options.find(o => o.id === optId);
        if (option) {
          total += Number(option.price);
        }
      });
    });

    return total * quantity;
  }, [product, selectedOptions, quantity]);

  if (!product) return null;

  const handleOptionToggle = (groupId: string, optionId: string, maxSelection: number) => {
    console.log('Option clicked:', { groupId, optionId, maxSelection });
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      const isSelected = current.includes(optionId);

      if (maxSelection === 1) {
        // Radio behavior
        return { ...prev, [groupId]: [optionId] };
      } else {
        // Checkbox behavior
        if (isSelected) {
          return { ...prev, [groupId]: current.filter(id => id !== optionId) };
        } else {
          if (current.length < maxSelection) {
            return { ...prev, [groupId]: [...current, optionId] };
          }
          return prev; // Max limit reached
        }
      }
    });
  };

  const handleAddToCart = () => {
    // Validate required selections
    const isValid = product.optionConfigs?.every(config => {
      const group = config.optionGroup;
      const selectedCount = (selectedOptions[group.id] || []).length;
      return selectedCount >= group.minSelection;
    });

    if (!isValid) {
      alert('Please select all required options');
      return;
    }

    // Flatten selected options for cart
    const flatOptions: { optionId: string; name: string; price: number; groupName: string }[] = [];
    product.optionConfigs?.forEach(config => {
      const group = config.optionGroup;
      const selectedIds = selectedOptions[group.id] || [];
      selectedIds.forEach(optId => {
        const option = group.options.find(o => o.id === optId);
        if (option) {
          flatOptions.push({
            optionId: option.id,
            name: option.name,
            price: Number(option.price),
            groupName: group.name
          });
        }
      });
    });

    onAddToCart({
      productId: product.id,
      product: {
        name: product.name
      },
      name: product.name,
      basePrice: product.basePrice,
      quantity,
      price: totalPrice / quantity, // Price per item including options
      selectedOptions: flatOptions,
      totalPrice
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[calc(95vh-240px)] sm:max-h-[calc(90vh-240px)] pointer-events-auto">
        <p className="text-sm text-gray-500 mb-6">{product.description}</p>

        {product.optionConfigs?.map((config) => (
          <div key={config.optionGroup.id} className="space-y-3 bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{config.optionGroup.name}</h3>
              <span className="text-xs text-gray-500">
                {config.optionGroup.maxSelection === 1 ? 'Select 1' : `Select up to ${config.optionGroup.maxSelection}`}
              </span>
            </div>

            <div className="space-y-2">
              {config.optionGroup.options.map((option) => {
                const isSelected = (selectedOptions[config.optionGroup.id] || []).includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionToggle(config.optionGroup.id, option.id, config.optionGroup.maxSelection)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all bg-white shadow-sm",
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:shadow-md hover:border-emerald-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                        config.optionGroup.maxSelection === 1 ? "rounded-full" : "rounded-md",
                        isSelected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                      )}>
                        {isSelected && <div className={cn(
                          "bg-white",
                          config.optionGroup.maxSelection === 1 ? "h-2.5 w-2.5 rounded-full" : "h-3 w-3 rounded-sm"
                        )} />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{option.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {Number(option.price) > 0 ? `+₹${option.price}` : 'Free'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="shrink-0 border-t bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-50 text-emerald-600"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-50 text-emerald-600"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button className="flex-1 justify-between h-11" onClick={handleAddToCart}>
            <span>Add Item</span>
            <span>₹{totalPrice}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
