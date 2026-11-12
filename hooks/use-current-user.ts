import { CurrentUser } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const fetchCurrentUser = async () => {
    try {        
        const { data } = await axios.get(`/api/user`);
        return data.data as CurrentUser;
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};

export const genCurrentUserQueryKeys = () => ["current-user"]
export const useCurrentUser = () => {
    return useQuery<CurrentUser,Error>({
        queryKey: [...genCurrentUserQueryKeys()],
        queryFn:(params)=>fetchCurrentUser(),
        staleTime: 1000 * 60 * 60 * 24, // Cache data for 1 day
    });
};