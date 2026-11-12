"use client"

import { CustomerPointLog } from '@/types/customerPointLogs';
import { PointEarningMethodFilters } from '@/types/pointEarningMethod';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchPointEarningHistory = async ({pageParam,filters}:{pageParam:number,filters:PointEarningMethodFilters}) => {
    try {        
        const { data } = await axios.get(`/api/rewards/points/history/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as CustomerPointLog[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const usePointEarningHistory = (filters:PointEarningMethodFilters) => {
    return useInfiniteQuery<CustomerPointLog[],Error>({
        queryKey: ["point-earning-history",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchPointEarningHistory({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};