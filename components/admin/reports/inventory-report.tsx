"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { useEffect, useMemo } from "react"
import { LOW_STOCK_QUANTITY } from "@/lib/consts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportButton } from "@/components/common/export-button"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

type InventoryReportItem = {
  id: string,
  name: string,
  sku: string,
  stock: string,
  available: string,
  status: string,
}

export function InventoryReport() {
  const productsQuery = useProducts({})
  const locale = useLocale()
  useEffect(()=>{
    if(productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) productsQuery.fetchNextPage()
  },[productsQuery.hasNextPage,productsQuery.isFetchingNextPage])


  const inventoryData = useMemo(()=>{
    const data:InventoryReportItem[] = []
    const flatProducts = productsQuery.data?.pages.flatMap(pg=>pg).flatMap(item=>item) ?? []
    for(const product of flatProducts){
      data.push({
        "id":product.id!,
        "name":getLocalizedValue(product.nameI18n,locale) ?? "",
        "available":(product.stock ?? 0).toLocaleString(),
        "status":product.stock === 0 ? "Out of Stock" : (product.stock ?? 0) <= LOW_STOCK_QUANTITY ? "Low Stock" : "In Stock",
        "sku":"---",
        "stock":(product.stock ?? 0).toLocaleString()
      })
    }
    
    return data
  },[productsQuery])
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Report</CardTitle>
            <CardDescription>Stock levels, low stock alerts, and inventory management.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <ExportButton
              data={inventoryData}
              filename="inventory-report"
              format="csv"
            />
            <ExportButton
              data={inventoryData}
              filename="inventory-report"
              format="excel"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold">{inventoryData.length.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">In Stock</p>
              <p className="text-2xl font-bold">{inventoryData.filter(i=>i.status === "In Stock").length.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryData.filter(i=>i.status === "Low Stock").length.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryData.filter(i=>i.status === "Out of Stock").length.toLocaleString()}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                {/* <TableHead>Reserved</TableHead>
                <TableHead>Available</TableHead> */}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  {/* <TableCell>{item.reserved}</TableCell>
                  <TableCell>{item.available}</TableCell> */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {item.status === "Low Stock" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      <Badge
                        variant={
                          item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "secondary" : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
