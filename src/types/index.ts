export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Option {
  id: string;
  name: string;
  price: number;
  maxQuantity?: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  options: Option[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
  optionConfigs?: {
    optionGroup: OptionGroup;
  }[];
}

export interface CartItem {
  productId: string;
  product: {
    name: string;
  };
  name: string;
  basePrice: number;
  quantity: number;
  price: number; // Total price per item including options
  selectedOptions: {
    optionId: string;
    name: string;
    price: number;
    groupName: string;
  }[];
  totalPrice: number;
}
