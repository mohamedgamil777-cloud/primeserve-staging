"use client"

import { ServiceFilters, ServiceItem, ServicePublicItem } from '@/types/services';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchServices = async ({pageParam,filters}:{pageParam:number,filters:ServiceFilters}) => {
    try {        
        const { data } = await axios.get(`/api/services/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as ServicePublicItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useServices = (filters:ServiceFilters) => {
    return useInfiniteQuery<ServicePublicItem[],Error>({
        queryKey: ["services",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchServices({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};