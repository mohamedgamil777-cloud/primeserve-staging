"use client"

import { PromotionCodeFilters, PromotionCode } from '@/types/promotionCode';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchPromotionCodes = async ({pageParam,filters}:{pageParam:number,filters:PromotionCodeFilters}) => {
    try {        
        const { data } = await axios.get(`/api/promotions/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as PromotionCode[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const usePromotionCodes = (filters:PromotionCodeFilters) => {
    return useInfiniteQuery<PromotionCode[],Error>({
        queryKey: ["promotions",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchPromotionCodes({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};