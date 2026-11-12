"use client"
import { useTranslations } from "next-intl"

import React, { JSX, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export type InfiniteScrollContainerProps<T> = {
	query: UseInfiniteQueryResult<InfiniteData<T[], unknown>, Error>
	renderItem: (item: T, index: number) => React.ReactNode
    keyExtractor:(item: T, index: number)=>string,
	containerClassName?: string
	skeletonClassName?: string
	animationEnabled?: boolean,
    customEmptyStateComponent?:React.ReactNode,
    customSkeletonComponent?:React.ReactNode,
}

const MotionDiv = motion.div

const ItemSkeleton = ({ count = 6, className, customSkeletonComponent }: { count?: number, className?:string, customSkeletonComponent?:React.ReactNode }) => (
	<>
		{Array.from({ length: count }).map((_, idx) => (
			<motion.div
				key={idx}
				className={cn("h-40 bg-gray-200 rounded-lg",className)}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.7 }}
				transition={{ duration: 0.3, delay: idx * 0.05 }}
			>
				{
					customSkeletonComponent
					??
					<Skeleton className="h-full w-full" />
				}
			</motion.div>
		))}
	</>
)

const InfiniteScrollContainer = <T,>({
	query,
	renderItem,
	containerClassName,
	animationEnabled = true,
    customEmptyStateComponent,
    keyExtractor,
	skeletonClassName,
	customSkeletonComponent
}: InfiniteScrollContainerProps<T>): JSX.Element => {
  const tu = useTranslations("ui")
	const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = query
	const [loadMoreRef, inView] = useInView({ threshold: 0.1, rootMargin: "200px" })

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, fetchNextPage])

	const flatData = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data])

	const ContainerComponent = animationEnabled ? MotionDiv : "div"

	return (
        <>
            <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", containerClassName)}>
                {isLoading ? (
                    <ItemSkeleton 
						className={skeletonClassName} 
						count={6} 
						customSkeletonComponent={customSkeletonComponent}
					/>
                ) : (
                    <>
                        {flatData.map((item, index) => (
                            <ContainerComponent
                                key={keyExtractor(item,index)}
                                initial={animationEnabled ? { opacity: 0, y: 20 } : undefined}
                                animate={animationEnabled ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                {renderItem(item, index)}
                            </ContainerComponent>
                        ))}
                        {hasNextPage && <div className="w-full" ref={loadMoreRef}></div>}
                        {isFetchingNextPage && <ItemSkeleton count={3} />}
                    </>
                )}
            </div>
            {(data?.pages.length === 0 || data?.pages.at(0)?.length === 0) && (
                customEmptyStateComponent
                ??
                <p className={"text-lg text-center my-14"}>{tu("noResults")}</p>
            )}
        </>
	)
}

export default InfiniteScrollContainer
