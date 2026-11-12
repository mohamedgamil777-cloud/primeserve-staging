import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ExistingAddress } from '@/types/address'; // Make sure to define this type accordingly

export function useAddresses() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const { data } = await axios.get('/api/addresses');
            return data.data as ExistingAddress[];
        }
    });

    const createAddress = useMutation({
        mutationFn: async (newAddress: Omit<ExistingAddress, 'id'>) => {
            const { data } = await axios.post('/api/addresses', newAddress);
            return data.data as ExistingAddress;
        },
        onMutate: async (newAddress) => {
            await queryClient.cancelQueries({ queryKey: ['addresses'] });

            const previous = queryClient.getQueryData<ExistingAddress[]>(['addresses']);

            queryClient.setQueryData<ExistingAddress[]>(['addresses'], (old = []) => [
                ...old,
                {
                    ...newAddress,
                    id: 'temp-id-' + Math.random(), // temp ID
                } as ExistingAddress,
            ]);

            return { previous };
        },
        onError: (_err, _newAddress, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['addresses'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const updateAddress = useMutation({
        mutationFn: async (updated: ExistingAddress) => {
            await axios.put(`/api/addresses/${updated.id}`, updated);
        },
        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: ['addresses'] });
            const previous = queryClient.getQueryData<ExistingAddress[]>(['addresses']);

            queryClient.setQueryData<ExistingAddress[]>(['addresses'], (old = []) =>
                old.map((addr) => (addr.id === updated.id ? { ...addr, ...updated } : addr))
            );

            return { previous };
        },
        onError: (_err, _updated, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['addresses'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const deleteAddress = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/api/addresses/${id}`);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['addresses'] });
            const previous = queryClient.getQueryData<ExistingAddress[]>(['addresses']);

            queryClient.setQueryData<ExistingAddress[]>(['addresses'], (old = []) =>
                old.filter((addr) => addr.id !== id)
            );

            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['addresses'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    return {
        ...query,
        createAddress: createAddress.mutate,
        updateAddress: updateAddress.mutate,
        deleteAddress: deleteAddress.mutate,
    };
}
