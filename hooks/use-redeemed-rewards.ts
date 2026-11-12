"use client"

import { RedeemedRewardFilters, RedeemedRewardItem } from '@/types/reward';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchRedeemedRewards = async ({pageParam,filters}:{pageParam:number,filters:RedeemedRewardFilters}) => {
    try {        
        const { data } = await axios.get(`/api/rewards/redeemed/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as RedeemedRewardItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useRedeemedRewards = (filters:RedeemedRewardFilters) => {
    return useInfiniteQuery<RedeemedRewardItem[],Error>({
        queryKey: ["redeemed-rewards",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchRedeemedRewards({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};