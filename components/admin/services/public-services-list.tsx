"use client"
import InfiniteScrollContainer from '@/components/common/infinite-scroll-container'
import { useServices } from '@/hooks/use-services'
import React from 'react'
import ServiceCard from './service-card'
import { PublicServicesEmpty } from '@/components/empty-states/public-empty-states'
import ServiceCardSkeleton from './service-card-skeleton'

type Props = {
  categoryId:string,
  detailed?:boolean
}

export default function PublicServicesList({categoryId,detailed}: Props) {
  const query = useServices({
    categoryId
  })
  
  return (
    <InfiniteScrollContainer
      query={query}
      keyExtractor={service=>service.id}
      renderItem={service=><ServiceCard detailed={detailed} service={service}/>}
      customEmptyStateComponent={<PublicServicesEmpty/>}
      customSkeletonComponent={<ServiceCardSkeleton/>}
      skeletonClassName=" h-auto"
    />
  )
}