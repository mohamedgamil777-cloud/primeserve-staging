"use client"
import { useTranslations } from "next-intl"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { signout } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export function NavUser() {
  const tx = useTranslations("ui")
  const queryClient = useQueryClient()
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { isLoading, data} = useCurrentUser()
  if(!data && !isLoading) return null
  const handleLogout = async ()=>{
    setLoggingOut(true)
    try {
      const res = await signout()
      if(res.error) toast.error(res.error)
      else if(res.success){
        await queryClient.invalidateQueries({"queryKey":["current-user"]})
        await queryClient.invalidateQueries()
        toast.success(tx("loggedOut"))
        router.push("/")
      }
    } catch (error) {
      toast.error(tx("somethingWrong"))
    }
    setLoggingOut(false)
  }
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
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data?.img ? `/imgs/users/${data.img}` : "/placeholder.png"} alt={data?.firstName ?? ""} />
                    <AvatarFallback className="rounded-lg">User</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data?.firstName} {data?.lastName}</span>
                    <span className="truncate text-xs">{data?.role}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              }
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.img ? `/imgs/users/${data.img}` : "/placeholder.png"} alt={data?.firstName ?? ""} />
                  <AvatarFallback className="rounded-lg">User</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.firstName} {data?.lastName}</span>
                  <span className="truncate text-xs">{data?.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={loggingOut} onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
