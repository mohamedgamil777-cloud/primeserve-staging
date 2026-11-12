import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DetailedBudget } from '@/types/budget';

export function useBudgets() {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data } = await axios.get('/api/budgets');
            return data.data as DetailedBudget[];
        }
    });
}
