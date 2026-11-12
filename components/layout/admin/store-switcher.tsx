"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveStoreStore } from "@/store/useActiveStoreStore"
import Link from "next/link"
import { genStoreLogoUrl } from "@/lib/store"
import { useLocale } from "next-intl"

export function StoreSwitcher() {
  const locale = useLocale()
  const teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[] = []
  const { activeStoreId, setActiveStoreId } = useActiveStoreStore()
	const { data, isLoading } = useCurrentUser()
  const { isMobile } = useSidebar()
  const activeStore =  activeStoreId ? (data?.stores.find(plc=>plc.id === activeStoreId) ?? data?.stores.at(0)) : data?.stores.at(0)

  React.useEffect(()=>{
    if(!activeStoreId && activeStore) setActiveStoreId(activeStore.id)
  },[activeStore,activeStoreId])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
							{
								isLoading
								?
								<>
									<Skeleton className=" aspect-square size-8 rounded-lg"/>
									<div className="grid flex-1 gap-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											<Skeleton className=" h-4 w-[80%]"/>
										</span>
										<Skeleton className=" h-4 w-[50%]"/>
									</div>
									<Skeleton className="ml-auto size-2" />
								</>
								:
								!!data?.stores.length
								?
								<>
									<Image 
										height={32} 
										width={32} 
										className=" aspect-square size-8 rounded-lg" 
										src={genStoreLogoUrl(activeStore?.image)} 
										alt={activeStore?.name ?? ""}
									/>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{activeStore?.name}
										</span>
										<span className="truncate text-xs">{activeStore?.slug}</span>
									</div>
									<ChevronsUpDown className="ml-auto" />
								</>
								:
								<>
								  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
                  </div>
                  <Link href={`/${locale}/register/store`}>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-muted-foreground">Add Store</div>
                      <div className="font-light text-sm text-muted-foreground">Add Your First Store</div>
                    </div>
                  </Link>
								</>
							}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {data?.stores.map((store, index) => (
              <DropdownMenuItem
                key={store.id}
                // onClick={() => setActiveTeam(store.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Image 
										className="size-4 shrink-0"
										height={16} 
										width={16} 
										src={genStoreLogoUrl(store.image)} 
										alt={store.name ?? ""}
									
									/>
                </div>
                {store.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href={`/${locale}/register/store`}>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add Store</div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
