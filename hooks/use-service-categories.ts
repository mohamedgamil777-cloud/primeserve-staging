import { DetailedServiceCategory } from '@/types/serviceCategory';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchServiceCategories = async () => {
    try {        
        const { data } = await axios.get(`/api/services/categories`);
        return data.data as DetailedServiceCategory[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};

export const genServiceCategoriesQueryKeys = () => ["service-categories"]
export const categoriesQueryConfig = {
    queryKey: [...genServiceCategoriesQueryKeys()],
    queryFn:()=>fetchServiceCategories(),
    staleTime: 1000 * 60 * 60 * 24, // Cache data for 1 day
}
export const useServiceCategories = () => {
    return useQuery<DetailedServiceCategory[],Error>(categoriesQueryConfig);
};