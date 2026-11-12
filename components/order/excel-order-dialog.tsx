"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as XLSX from "xlsx";
import { getProductListForExcel } from "@/actions/product";
import { useCart } from "@/hooks/use-cart";
import { useTranslations } from "next-intl";


export function ExcelOrderButton() {
  const t = useTranslations()
  const { addItems } = useCart()
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate and process the order data
      const orderItems = jsonData.map((item: any) => ({
        productId: item["Product ID"] as string,
        quantity: item["Amount Needed"] as string,
      }));

      const parsedOrderItems = orderItems.filter(item=>!!item.productId && !!item.quantity && !isNaN(Number(item.quantity)))
        .map(item=>({"product":{"id":item.productId},"quantity":Number(item.quantity)}))
      addItems(parsedOrderItems as any)
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = async () => {
    setIsLoading(true);
    try {
      // Fetch available products from your API
      const res = await getProductListForExcel()
      if(!res.data) return setIsLoading(false)
      const products = res.data;

      // Prepare worksheet data
      const worksheetData = products.map(product => ({
        "Product ID": product.id,
        "Product Name": product.name,
        "Description": product.description,
        "Available Stock": product.stock,
        "Amount Needed": "", // Empty for customer to fill
      }));

      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Order Template");

      // Generate file and download
      XLSX.writeFile(workbook, "order_template.xlsx", { compression: true });

    } catch (error) {
      console.error("Error generating template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          {t('order-by-excel')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t('bulk-order-via-excel')}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instructions">{t('instructions')}</TabsTrigger>
            <TabsTrigger value="download">{t('download-template')}</TabsTrigger>
            <TabsTrigger value="upload">{t('upload-file')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>{t('how-to-use-excel-order')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{t('step-1-download-the-template')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('get-our-pre-formatted-excel-file-with-current-product-availability')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{t('step-2-fill-in-your-order')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('enter-the-quantities-you-need-in-the-amount-needed-column')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('do-not-modify-other-columns-as-theyre-used-for-validation')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{t('step-3-upload-your-file')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('well-validate-your-order-and-add-available-items-to-your-cart')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="download">
            <Card>
              <CardHeader>
                <CardTitle>{t('download-template')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {t('download-our-excel-template-with-current-product-availability')}
                </p>
                <Button 
                  onClick={downloadTemplate} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : t('download-excel-template')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>{t('upload-your-order-file')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="excelFile">{t('excel-file')}</Label>
                  <Input 
                    id="excelFile" 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('upload-your-filled-excel-template-with-order-details')}
                  </p>
                </div>
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={!file || isLoading}
                >
                  {isLoading ? "Processing..." : t('upload-and-add-to-cart')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}