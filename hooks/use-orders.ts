"use client"

import { OrderFilters, OrderItem } from '@/types/order';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchOrders = async ({pageParam,filters}:{pageParam:number,filters:OrderFilters}) => {
    try {        
        const { data } = await axios.get(`/api/orders/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as OrderItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useOrders = (filters:OrderFilters) => {
    return useInfiniteQuery<OrderItem[],Error>({
        queryKey: ["orders",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchOrders({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};