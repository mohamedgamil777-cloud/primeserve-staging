"use client"

import React, { JSX, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, range } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { cva } from "class-variance-authority"

// Define table variants using class-variance-authority
const tableVariants = cva("rounded-md overflow-hidden", {
  variants: {
    variant: {
      default: "",
      striped: "border",
      bordered: "border border-2",
      compact: "border text-sm",
      minimal: "border border-0 shadow-sm",
      modern: "border border-0 shadow-lg rounded-xl overflow-hidden",
      headerLess: "border border-2 shadow-sm rounded-lg overflow-hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define header variants
const headerVariants = cva("text-center font-medium w-full", {
  variants: {
    variant: {
      default: "",
      striped: "bg-zinc-500 text-white",
      bordered: "bg-zinc-500 text-white",
      compact: "bg-zinc-500 text-white",
      minimal: "bg-slate-100 text-slate-900 border-b",
      modern: "bg-primary text-primary-foreground",
      headerLess: "hidden bg-white text-slate-600 border-b border-slate-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define header cell variants
const headerCellVariants = cva("", {
  variants: {
    variant: {
      default: "",
      striped: "border-solid border-2 border-gray-400 text-white",
      bordered: "border-solid border-2 border-gray-400 text-white",
      compact: "border-solid border-1 border-gray-400 text-white p-2",
      minimal: "border-0 text-slate-900 p-3",
      modern: "border-0 text-primary-foreground p-4",
      headerLess: "border-0 text-slate-600 p-4 font-medium text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define row variants
const rowVariants = cva("", {
  variants: {
    variant: {
      default: "",
      striped: "even:bg-slate-200 hover:bg-slate-100",
      bordered: "hover:bg-slate-100",
      compact: "hover:bg-slate-100",
      minimal: "border-b border-slate-200 hover:bg-slate-50",
      modern: "border-b border-slate-100 hover:bg-slate-50",
      headerLess: "border-b border-slate-100 hover:bg-slate-50 py-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define cell variants
const cellVariants = cva("text-center font-bold", {
  variants: {
    variant: {
      default: "",
      striped: "border-solid border-2 border-gray-400 text-card-foreground",
      bordered: "border-solid border-2 border-gray-400 text-card-foreground",
      compact: "border-solid border-1 border-gray-400 text-card-foreground p-2",
      minimal: "border-0 text-card-foreground p-3",
      modern: "border-0 text-card-foreground p-4",
      headerLess: "border-0 text-slate-800 py-4 px-4 font-normal",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define empty state variants
const emptyStateVariants = cva("w-full p-4 font-bold text-xl text-center", {
  variants: {
    variant: {
      default: "",
      striped: "bg-[#b6c5d6]",
      bordered: "bg-[#b6c5d6]",
      compact: "bg-[#b6c5d6]",
      minimal: "bg-slate-100",
      modern: "bg-primary/10 text-primary p-8",
      headerLess: "bg-slate-50 text-slate-500 p-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type TableCol<T> = {
  order: number
  head: string
  headClassName?: string
  cell: (allData: T[], rowData: T, idx: number) => React.ReactNode
  cellClassName?: (allData: T[], rowData: T, idx: number) => string
  hidden?: boolean,
}

export type TableVariant = "default" | "striped" | "bordered" | "compact" | "minimal" | "modern" | "headerLess"

export type Props<T> = {
  query: UseInfiniteQueryResult<InfiniteData<T[], unknown>, Error>
  cols: TableCol<T>[]
  tableFooter?: React.ReactNode
  dir?: "rtl" | "ltr"
  variant?: TableVariant
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
  emptyStateClassName?: string
  animationEnabled?: boolean
  emptyStateComponent?:React.ReactNode
}

export const MotionTableRow = motion(TableRow)

export const TableSkeleton = <T,>({
  rowsCount = 20,
  cols,
  variant = "default",
  cellClassName,
}: {
  rowsCount?: number
  cols: TableCol<T>[]
  variant?: TableVariant
  cellClassName?: string
}) => (
  <>
    {range(0, rowsCount).map((idx) => (
      <MotionTableRow
        key={idx}
        className={cn(rowVariants({ variant }))}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.3, delay: idx * 0.03 }}
      >
        {cols.map((col) =>
          !col.hidden ? (
            <TableCell key={`${col.head}-${idx}`} className={cn(cellVariants({ variant }), cellClassName)}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ) : null,
        )}
      </MotionTableRow>
    ))}
  </>
)

const InfiniteScrollTable = <T,>({
  query,
  cols,
  tableFooter,
  dir = "ltr",
  variant = "default",
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  emptyStateClassName,
  animationEnabled = true,
  emptyStateComponent
}: Props<T>): JSX.Element => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = query
  const [loadMoreRef, inView] = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const sortedCols = useMemo(() => cols.sort((col1, col2) => col1.order - col2.order), [cols])
  const flatData = useMemo(() => data?.pages.flatMap(pg=>pg).flatMap(item=>item), [data])

  const RowComponent = animationEnabled ? MotionTableRow : TableRow
  return (
    <div className={cn(tableVariants({ variant }), className)}>
      <Table dir={dir} className={cn("overflow-hidden max-w-full", tableClassName)}>
        <TableHeader dir={dir} className={cn(headerVariants({ variant }), headerClassName)}>
          <TableRow className="group">
            {sortedCols.map((col, idx) =>
              !col.hidden ? (
                <TableHead className={cn(headerCellVariants({ variant }), col.headClassName)} key={col.head + idx}>
                  {col.head}
                </TableHead>
              ) : null,
            )}
          </TableRow>
        </TableHeader>
        <TableBody className={dir}>
          {isLoading ? (
            <TableSkeleton cols={sortedCols} rowsCount={10} variant={variant} cellClassName={cellClassName} />
          ) : (
            <>
              {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.map((row, rowIdx) => (
                    <RowComponent
                      className={cn(rowVariants({ variant }), rowClassName)}
                      key={`${rowIdx}-${pageIndex}`}
                      initial={animationEnabled ? { opacity: 0, y: 20 } : undefined}
                      animate={animationEnabled ? { opacity: 1, y: 0 } : undefined}
                      transition={{ duration: 0.3, delay: rowIdx * 0.05 }}
                    >
                      {sortedCols.map((col, idx) =>
                        !col.hidden ? (
                          <TableCell
                            className={cn(
                              cellVariants({ variant }),
                              cellClassName,
                              col.cellClassName && col.cellClassName(flatData ?? [], row, rowIdx),
                            )}
                            key={col.head + rowIdx + idx}
                          >
                            {col.cell(flatData ?? [], row, pageIndex * 10 + rowIdx)}
                          </TableCell>
                        ) : null,
                      )}
                    </RowComponent>
                  ))}
                </React.Fragment>
              ))}
              {hasNextPage && (
                <>
                  <div className="w-full" ref={loadMoreRef}></div>
                  {animationEnabled && (
                    <TableSkeleton cols={sortedCols} rowsCount={5} variant={variant} cellClassName={cellClassName} />
                  )}
                </>
              )}
              {isFetchingNextPage && animationEnabled && (
                <TableSkeleton cols={sortedCols} rowsCount={5} variant={variant} cellClassName={cellClassName} />
              )}
              {tableFooter}
            </>
          )}
        </TableBody>
      </Table>
      {(data?.pages.length === 0 || data?.pages.at(0)?.length === 0) && (
        emptyStateComponent
        ??
        <p className={cn(emptyStateVariants({ variant }), emptyStateClassName)}>No Results Found.</p>
      )}
    </div>
  )
}

export default InfiniteScrollTable

