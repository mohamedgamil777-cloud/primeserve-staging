import { UserRole } from "@/db/schema/users"
import { redirect } from "next/navigation"

export default function RedirectToDashboard({role}:{role:UserRole}) {
  return redirect(
    role === "seller" 
    ?
    "/admin"
    :
    role === "customer"
    ?
    "/account"
    :
    "/" 
  )  
}