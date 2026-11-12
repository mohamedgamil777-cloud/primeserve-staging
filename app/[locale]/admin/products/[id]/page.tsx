import ProductForm from "@/components/product/product-form"
import { db } from "@/db"
import { getTenantId } from "@/lib/tenant"



export default async function page({params}:{"params":Promise<{"id":string}>}) {
  const [{ id:productId }, storeId] = await Promise.all([params,getTenantId()])
  const product = productId === "new" ? undefined : await db.query.products.findFirst({
    "where":(products,{eq,and})=>and(
      eq(products.id,productId),
      eq(products.storeId,storeId)
    )
  })
  
  return (
    <ProductForm product={product}/>
  )
}
