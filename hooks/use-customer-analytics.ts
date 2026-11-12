import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AnalyticsRange, CustomerAnalytics } from '@/types/analytics';

export function useCustomerAnalytics(range:AnalyticsRange) {
    return useQuery({
        queryKey: ['customer-analytics',{range}],
        queryFn: async () => {
            const { data } = await axios.get(`/api/analytics/customer?range=${range}`);
            return data.data as CustomerAnalytics;
        }
    });
}
