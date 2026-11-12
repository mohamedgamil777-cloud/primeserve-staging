"use client"

import { TierFilters, TierItem } from '@/types/tier';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchTiers = async ({pageParam,filters}:{pageParam:number,filters:TierFilters}) => {
    try {        
        const { data } = await axios.get(`/api/rewards/tiers/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as TierItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useTiers = (filters:TierFilters) => {
    return useInfiniteQuery<TierItem[],Error>({
        queryKey: ["tiers",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchTiers({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};