import api from './api';

export interface CreateOrderData {
  shopId: string;
  items: {
    productId: string;
    quantity: number;
    options?: {
      optionId: string;
    }[];
  }[];
}

export const createOrder = async (data: CreateOrderData) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getOrder = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
