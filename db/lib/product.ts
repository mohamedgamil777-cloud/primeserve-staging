import { ProductFilters, ProductItem } from "@/types/product"
import { db } from ".."
import { LOW_STOCK_QUANTITY } from "@/lib/consts"


export const getProductItems = async (storeId:string,filter:Omit<ProductFilters,"categoryIds"|"subcategoryIds"> & {categoryIds?:string[],subcategoryIds?:string[]},page:number):Promise<ProductItem[]> =>{
    return await db.query.products.findMany({
        "columns":{
            id: true,
            nameI18n: true,
            descriptionI18n: true,
            mainImage: true,
            price: true,
            stock: true,
            isNew: true,
            discountPercentage: true,
            rating: true,
            reviewCount: true,
            categoryId: true,
            subcategoryId: true,
        },
        "with":{
            "category":{
                "columns":{
                    "nameI18n":true
                }
            }
        },
        "where":(products,{eq,sql,or,gt,lte,gte,lt,inArray,and})=>and(
            eq(products.storeId,storeId),
            // !filter.query ? undefined : or(sql`${products.name} ILIKE ${`%${filter.query}%`}`,sql`${products.description} ILIKE ${`%${filter.query}%`}`),
            !filter.categoryId ? undefined : eq(products.categoryId,filter.categoryId),
            (!filter.categoryIds || filter.categoryIds.length === 0) ? undefined : inArray(products.categoryId,filter.categoryIds),
            (!filter.subcategoryIds || filter.subcategoryIds.length === 0) ? undefined : inArray(products.subcategoryId,filter.subcategoryIds),
            !filter.status ? undefined : (
                filter.status === "active" 
                ?
                gt(products.stock,LOW_STOCK_QUANTITY)
                :
                filter.status === "low-stock"
                ?
                and(
                    gt(products.stock,0),
                    lte(products.stock,LOW_STOCK_QUANTITY)
                )
                :
                eq(products.stock,0)
            ),
            filter.priceRange === "under-50"
            ?
            lt(products.price,50)
            :
            filter.priceRange === "over-100"
            ?
            gt(products.price,100)
            :
            filter.priceRange === "50-100"
            ?
            and(
                gte(products.price,50),
                lte(products.price,100)
            )
            :
            undefined
        ),
        "offset":(page - 1)*10,
        "limit":10,
        "orderBy":(products,{asc,desc})=>(
            filter.sort === "price-low-high"
            ?
            asc(products.price)
            :
            filter.sort === "price-high-low"
            ?
            desc(products.price)
            :
            filter.sort === "newest"
            ?
            desc(products.createdAt)
            :
            filter.sort === "rating"
            ?
            desc(products.rating)
            :
            desc(products.updatedAt)
        )
    })
}