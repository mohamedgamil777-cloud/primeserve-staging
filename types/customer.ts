import { ExistingUser } from "./user";

export type CustomerSort = "most-orders"|"last-order"|"highest-spent"|"newest"|"oldest"
export type CustomerStatus = "active"|"inactive"| "all"

export type CustomerFilters = {
    query?:string,
    status?:CustomerStatus,
    sort?:CustomerSort,
}


export type CustomerItem = Pick<ExistingUser,"id"|"firstName"|"lastName"|"email"|"img"|"createdAt"> & {
    "orders":number,
    "spent":number,
    "status":CustomerStatus,
    "lastOrderDate":Date|null,
}