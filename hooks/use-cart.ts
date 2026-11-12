import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './use-current-user';
import axios from 'axios';
import { DetailedCartItem } from '@/types/cart';
import { useEffect, useState } from 'react';
import { RedeemedRewardItem } from '@/types/reward';
import { useCartStore } from '@/store/useCartStore';

const LOCAL_CART_KEY = 'guest-cart';

function getGuestCart(): DetailedCartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveGuestCart(items: DetailedCartItem[]) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function useCart() {
    const { data: session,isLoading } = useCurrentUser();
    const {
        reward:appliedReward,
        setReward:setAppliedReward,
        promoCode:appliedPromoCode,
        setPromoCode:setAppliedPromoCode
     } = useCartStore(state=>state)
    // const [appliedReward, setAppliedReward] = useState<RedeemedRewardItem | null>(() => getAppliedReward());
    const queryClient = useQueryClient();
    const isLoggedIn = !!session?.id;

    const query = useQuery({
        queryKey: ['cart'],
        enabled:!isLoading,
        queryFn: async () => {
            if (isLoggedIn) {
                const { data } = await axios.get(`/api/cart`);
                return data.data as DetailedCartItem[];
            } else {
                return getGuestCart();
            }
        },
    });

    const applyReward = (reward: RedeemedRewardItem) => {
        setAppliedReward(reward);
        // if (!isLoggedIn) saveAppliedReward(reward);
    };

    const removeReward = () => {
        setAppliedReward(null);
        // if (!isLoggedIn) saveAppliedReward(null);
    };


    const addItems = useMutation({
        mutationFn: async (items: DetailedCartItem[]) => {
            if (isLoggedIn) {
                await axios.post('/api/cart',{
                    products:items.map(item=>(
                        {
                            productId: item.product.id,
                            quantity: item.quantity,
                        }
                    ))
                });
            } else {
                // Guest handled in onMutate
            }
        },
        onMutate: async (items) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const prevCart = queryClient.getQueryData<DetailedCartItem[]>(['cart']) || [];
            // ignore local mutation if data is incomplete
            if(!items.at(0)?.product.nameI18n) return { prevCart };
            const updatedCart = [...prevCart];
            for(const item of items){
                const exists = updatedCart.find((i) => i.product.id === item.product.id);
    
                if (exists) {
                    exists.quantity += item.quantity;
                } else {
                    updatedCart.push(item);
                }
            }

            if (!isLoggedIn) saveGuestCart(updatedCart);

            queryClient.setQueryData(['cart'], updatedCart);
            return { prevCart };
        },
        onError: (_err, _item, context) => {
            if (context?.prevCart) {
                queryClient.setQueryData(['cart'], context.prevCart);
                if (!isLoggedIn) saveGuestCart(context.prevCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const updateItemQuantity = useMutation({
        mutationFn: async ({ productId, newQuantity }: { productId: string; newQuantity: number }) => {
            if (isLoggedIn) {
                await axios.put(`/api/cart/${productId}`, { newQuantity });
            }
        },
        onMutate: async ({ productId, newQuantity }) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const prevCart = queryClient.getQueryData<DetailedCartItem[]>(['cart']) || [];

            const updatedCart = prevCart.map((item) =>
                item.product.id === productId ? { ...item, quantity: newQuantity } : item
            );

            if (!isLoggedIn) saveGuestCart(updatedCart);
            queryClient.setQueryData(['cart'], updatedCart);
            return { prevCart };
        },
        onError: (_err, _vars, context) => {
            if (context?.prevCart) {
                queryClient.setQueryData(['cart'], context.prevCart);
                if (!isLoggedIn) saveGuestCart(context.prevCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const removeItem = useMutation({
        mutationFn: async (productId: string) => {
            if (isLoggedIn) {
                await axios.delete(`/api/cart/${productId}`);
            }
        },
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const prevCart = queryClient.getQueryData<DetailedCartItem[]>(['cart']) || [];

            const updatedCart = prevCart.filter((i) => i.product.id !== productId);
            if (!isLoggedIn) saveGuestCart(updatedCart);
            queryClient.setQueryData(['cart'], updatedCart);
            return { prevCart };
        },
        onError: (_err, _productId, context) => {
            if (context?.prevCart) {
                queryClient.setQueryData(['cart'], context.prevCart);
                if (!isLoggedIn) saveGuestCart(context.prevCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const clearCart = async () => {
        if (isLoggedIn) {
            await axios.delete('/api/cart');
            await queryClient.invalidateQueries({ queryKey: ['cart'] });
        } else {
            saveGuestCart([]);
            queryClient.setQueryData(['cart'], []);
        }
    };

    useEffect(() => {
        if (!session?.id) return;
        const localItems = getGuestCart();
        if (localItems.length > 0) {
            addItems.mutate(localItems, {
                onSuccess: async() => {
                    saveGuestCart([]);
                    await queryClient.invalidateQueries({ queryKey: ['cart'] });
                },
            });
        }
    }, [session]);


    const subtotal = query.data?.reduce((total, item) => {
        const price = item.product.discountPercentage > 0
            ? item.product.price * (1 - item.product.discountPercentage / 100)
            : item.product.price;
        return total + price * item.quantity;
    }, 0) ?? 0;

    const promoCodeDiscount = (
        appliedPromoCode?.type === "fixed" 
        ? 
        (appliedPromoCode.value ?? 0)
        :
        appliedPromoCode?.type === "percentage"
        ?
        ((appliedPromoCode.value ?? 0) / 100) * subtotal
        :
        0
    )
    const rewardDiscount = appliedReward?.reward?.type === 'discount' && subtotal >= appliedReward.reward.minPurchase
        ? (appliedReward.reward.value ?? 0)
        : 0;

    const discount = rewardDiscount + promoCodeDiscount

    const baseShipping = 0;

    const shippingDiscount = (
        appliedReward?.reward?.type === 'shipping' || appliedPromoCode?.type === "shipping" 
        ? baseShipping : 0
    )

    const shipping = baseShipping - shippingDiscount;

    const finalTotal = subtotal + shipping - discount;

    const tax = 0

    return {
        ...query,
        addItems: addItems.mutate,
        updateItemQuantity: updateItemQuantity.mutate,
        removeItem: removeItem.mutate,
        clearCart,
        appliedReward,
        applyReward,
        removeReward,
        appliedPromoCode,
        setAppliedPromoCode,
        subtotal,
        tax,
        rewardDiscount,
        promoCodeDiscount,
        discount,
        baseShipping,
        shippingDiscount,
        shipping,
        finalTotal,
        totalItems: query.data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    };
}
