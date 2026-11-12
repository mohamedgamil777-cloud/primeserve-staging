import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCurrentUser } from './use-current-user';


export const fetchActiveReminders = async () => {
    try {        
        const { data } = await axios.get(`/api/products/reminders`);
        return data.data as string[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};

export const genActiveRemindersQueryKeys = () => ["active-product-reminders"]
export const useActiveReminders = () => {
    const { data } = useCurrentUser()
    return useQuery<string[],Error>({
        enabled:!!data,
        queryKey: [...genActiveRemindersQueryKeys()],
        queryFn:()=>fetchActiveReminders(),
        staleTime: 1000 * 60 * 60 * 24, // Cache data for 1 day
    })
}