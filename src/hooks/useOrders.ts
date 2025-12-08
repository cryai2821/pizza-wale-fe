import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, getMyOrders, getOrder, CreateOrderData } from '@/lib/orders';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
};
