import { DetailedCategory } from '@/types/category';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchCategories = async () => {
    try {        
        const { data } = await axios.get(`/api/categories`);
        return data.data as DetailedCategory[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};

export const genCategoriesQueryKeys = () => ["categories"]
export const categoriesQueryConfig = {
    queryKey: [...genCategoriesQueryKeys()],
    queryFn:()=>fetchCategories(),
    staleTime: 1000 * 60 * 60 * 24, // Cache data for 1 day
}
export const useCategories = () => {
    return useQuery<DetailedCategory[],Error>(categoriesQueryConfig);
};