import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, getMyOrders, getOrder, CreateOrderData } from '@/lib/orders';
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId || !query.data?.shopId) return;

    // Listen to real-time updates from Firestore using the shop path
    const orderDocRef = doc(db, 'shops', query.data.shopId, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreData = snapshot.data();
        
        // Update the React Query cache with the new status from Firestore
        queryClient.setQueryData(['order', orderId], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            status: firestoreData.status,
            updatedAt: firestoreData.updatedAt?.toDate() || new Date(),
          };
        });
      }
    }, (error) => {
      console.error("Firestore listener error:", error);
    });

    return () => unsubscribe();
  }, [orderId, query.data?.shopId, queryClient]);

  return query;
};
