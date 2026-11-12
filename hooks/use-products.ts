"use client"

import { ExistingProduct, ProductFilters, ProductItem, ProductStatus } from '@/types/product';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchProducts = async ({pageParam,filters}:{pageParam:number,filters:ProductFilters}) => {
    try {        
        const { data } = await axios.get(`/api/products/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as ProductItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useProducts = (filters:ProductFilters) => {
    return useInfiniteQuery<ProductItem[],Error>({
        queryKey: ["products",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchProducts({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};