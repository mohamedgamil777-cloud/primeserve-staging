"use client"

import { RewardFilters, RewardItem } from '@/types/reward';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchRewards = async ({pageParam,filters}:{pageParam:number,filters:RewardFilters}) => {
    try {        
        const { data } = await axios.get(`/api/rewards/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as RewardItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useRewards = (filters:RewardFilters) => {
    return useInfiniteQuery<RewardItem[],Error>({
        queryKey: ["rewards",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchRewards({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};