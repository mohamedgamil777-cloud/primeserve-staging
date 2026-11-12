"use client"

import { PointEarningMethodFilters, PointEarningMethod } from '@/types/pointEarningMethod';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchPointEarningMethods = async ({pageParam,filters}:{pageParam:number,filters:PointEarningMethodFilters}) => {
    try {        
        const { data } = await axios.get(`/api/rewards/points/earning-methods/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as PointEarningMethod[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const usePointEarningMethods = (filters:PointEarningMethodFilters) => {
    return useInfiniteQuery<PointEarningMethod[],Error>({
        queryKey: ["point-earning-methods",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchPointEarningMethods({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};