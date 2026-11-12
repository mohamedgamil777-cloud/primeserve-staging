import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AnalyticData, AnalyticsRange } from '@/types/analytics';

export function useAnalytics(range:AnalyticsRange) {
    return useQuery({
        queryKey: ['analytics',{range}],
        queryFn: async () => {
            const { data } = await axios.get(`/api/analytics?range=${range}`);
            return data.data as AnalyticData;
        }
    });
}
