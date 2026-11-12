"use client"

import { CustomerFilters, CustomerItem } from '@/types/customer';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchCustomers = async ({pageParam,filters}:{pageParam:number,filters:CustomerFilters}) => {
    try {        
        const { data } = await axios.get(`/api/customers/?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as CustomerItem[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useCustomers = (filters:CustomerFilters) => {
    return useInfiniteQuery<CustomerItem[],Error>({
        queryKey: ["customers",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchCustomers({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};