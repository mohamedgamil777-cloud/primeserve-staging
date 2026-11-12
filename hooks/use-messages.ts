"use client"

import { MessageFilters, ContactMessage, UpdateMessagePayload } from '@/types/message';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


export const fetchMessages = async ({pageParam,filters}:{pageParam:number,filters:MessageFilters}) => {
    try {        
        const { data } = await axios.get(`/api/messages?page=${pageParam}&${(new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(ent=>!!ent[1]))).toString())}`);
        return data.data as ContactMessage[];
    } catch (error) {
        throw new Error((error as any).response?.data?.error ?? "something went wrong")
    }
};


export const useMessages = (filters:MessageFilters) => {
    return useInfiniteQuery<ContactMessage[],Error>({
        queryKey: ["messages",filters],
        initialPageParam:1,
        queryFn:(params)=>fetchMessages({pageParam:(params.pageParam ?? 1) as number,filters}),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
    });
};

type MessagesCache = {
  pages: ContactMessage[][]
  pageParams: unknown[]
}
export const useUpdateMessage = (filters?: MessageFilters) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateMessagePayload) => {
      const { data } = await axios.patch(`/api/messages/${id}`, payload)
      return data as ContactMessage
    },

    // Optimistic update
    onMutate: async (updatedMessage) => {
      // Cancel all queries that start with 'messages'
      await queryClient.cancelQueries({ queryKey: ['messages'] })

      // Find all query cache entries that match the messages query
      const queryCache = queryClient.getQueryCache()
      const messagesQueries = queryCache.findAll({ queryKey: ['messages'] })

      // Store previous data for all matching queries
      const previousData = messagesQueries.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data
      }))

      // Update all matching queries
      messagesQueries.forEach(query => {
        const data = query.state.data as MessagesCache | undefined
        if (!data) return

        const newData: MessagesCache = {
          pages: data.pages.map((page) =>
            page.map((msg) =>
              msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
            )
          ),
          pageParams: [...data.pageParams],
        }

        queryClient.setQueryData(query.queryKey, newData)
      })

      return { previousData }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        // Rollback all queries
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSettled: () => {
      // Invalidate all messages queries
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}