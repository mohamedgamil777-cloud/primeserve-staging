import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './use-current-user';
import axios from 'axios';
import { WishListFilters, WishlistItem } from '@/types/wishlist';
import { useEffect } from 'react';

const LOCAL_CART_KEY = 'guest-wishlist';

function getGuestWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveGuestWishlist(items: WishlistItem[]) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function useWishlist(filters:WishListFilters) {
    const { data: session,isLoading } = useCurrentUser();
    const queryClient = useQueryClient();
    const isLoggedIn = !!session?.id;

    const query = useQuery({
        queryKey: ['wishlist',filters],
        enabled:!isLoading,
        queryFn: async () => {
            if (isLoggedIn) {
                const { data } = await axios.get(`/api/wishlist?${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
                return data.data as WishlistItem[];
            } else {
                return getGuestWishlist();
            }
        },
    });

    const addItem = useMutation({
        mutationFn: async (item: WishlistItem) => {
            if (isLoggedIn) {
                await axios.post('/api/wishlist', {
                    productId: item.id,
                });
            } else {
                // Guest handled in onMutate
            }
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] });
            const prevWishlist = queryClient.getQueryData<WishlistItem[]>(['wishlist']) || [];

            const updatedWishlist = [...prevWishlist];
            const exists = updatedWishlist.find((i) => i.id === item.id);

            if (!exists) {
                updatedWishlist.push(item);
            }

            if (!isLoggedIn) saveGuestWishlist(updatedWishlist);

            queryClient.setQueryData(['wishlist'], updatedWishlist);
            return { prevWishlist };
        },
        onError: (_err, _item, context) => {
            if (context?.prevWishlist) {
                queryClient.setQueryData(['wishlist'], context.prevWishlist);
                if (!isLoggedIn) saveGuestWishlist(context.prevWishlist);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });


    const removeItem = useMutation({
        mutationFn: async (productId: string) => {
            if (isLoggedIn) {
                await axios.delete(`/api/wishlist/${productId}`);
            }
        },
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] });
            const prevWishlist = queryClient.getQueryData<WishlistItem[]>(['wishlist']) || [];

            const updatedWishlist = prevWishlist.filter((i) => i.id !== productId);
            if (!isLoggedIn) saveGuestWishlist(updatedWishlist);
            queryClient.setQueryData(['wishlist'], updatedWishlist);
            return { prevWishlist };
        },
        onError: (_err, _productId, context) => {
            if (context?.prevWishlist) {
                queryClient.setQueryData(['wishlist'], context.prevWishlist);
                if (!isLoggedIn) saveGuestWishlist(context.prevWishlist);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const clearWishlist = async () => {
        if (isLoggedIn) {
            await axios.delete('/api/wishlist');
            await queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        } else {
            saveGuestWishlist([]);
            queryClient.setQueryData(['wishlist'], []);
        }
    };


    useEffect(() => {
        (async ()=>{
            if (!session?.id) return;
            const localItems = getGuestWishlist();
            if (localItems.length > 0) {
                await Promise.all(
                    localItems.map(async item=> await addItem.mutateAsync(item))
                )
                saveGuestWishlist([]);
                await queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            }
        })()
    }, [session]);

    return {
        ...query,
        addItem: addItem.mutate,
        removeItem: removeItem.mutate,
        clearWishlist,
    };
}
