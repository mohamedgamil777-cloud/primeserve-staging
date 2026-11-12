"use client"

import { DetailedServiceRequest, ServiceRequestFilters } from '@/types/serviceRequest';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchServiceRequests = async ({pageParam,filters}:{pageParam:number,filters:ServiceRequestFilters}) => {
    try {        
        const { data } = await axios.get(`/api/services/requests?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as DetailedServiceRequest[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useServiceRequests = (filters:ServiceRequestFilters) => {
    return useInfiniteQuery<DetailedServiceRequest[],Error>({
        queryKey: ["service-requests",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchServiceRequests({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};