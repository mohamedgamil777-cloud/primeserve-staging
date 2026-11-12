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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as XLSX from "xlsx";
import { getProductListForExcel, updateProductsStock } from "@/actions/product";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  stock: number;
  // Add other product fields as needed
}

export function AdminStockExcelManager() {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateMode, setUpdateMode] = useState<"replace" | "add">("replace");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setUploadError(null);
    
    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate the uploaded data
      if (!jsonData.length) {
        throw new Error("The file contains no data");
      }

      const requiredFields = ["Product ID", "Product Name", "Current Stock"];
      const missingFields = requiredFields.filter(
        field => !Object.keys(jsonData[0] as object).includes(field)
      );

      if (missingFields.length) {
        throw new Error(`Missing required columns: ${missingFields.join(", ")}`);
      }

      // Prepare update data
      const stockUpdates = jsonData.map((item: any) => ({
        id: item["Product ID"],
        stock: Number(item["Current Stock"]),
      }));

      await updateProductsStock(stockUpdates,updateMode)
      await queryClient.invalidateQueries({"queryKey":["products"]})
      // Show success and close dialog
      setIsDialogOpen(false);
      toast.success("Stock updated successfully!");
      
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadStockReport = async () => {
    setIsLoading(true);
    try {
      // Fetch current products from your API
      const res = await getProductListForExcel()
      if(!res.data) return setIsLoading(false)
      const products = res.data;

      // Prepare worksheet data
      const worksheetData = products.map(product => ({
        "Product ID": product.id,
        "Product Name": product.name,
        "Current Stock": product.stock,
        "Notes": "" // Empty column for admin notes
      }));

      // Create workbook with styling
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Product ID
        { wch: 30 }, // Product Name
        { wch: 15 }, // Current Stock
        { wch: 40 }  // Notes
      ];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");
      
      // Add instructions sheet
      const instructions = [
        ["INSTRUCTIONS"],
        ["1. Update the 'Current Stock' column with your changes"],
        ["2. Do not modify 'Product ID' or 'Product Name' columns"],
        ["3. You can add notes in the 'Notes' column if needed"],
        ["4. Save the file and upload it back to the system"],
        ["", "", ""],
        ["IMPORTANT: The system will validate all stock values are numbers"]
      ];
      
      const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");

      // Generate file and download
      XLSX.writeFile(workbook, `stock_report_${new Date().toISOString().split('T')[0]}.xlsx`, {
        compression: true
      });

    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate stock report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Manage Stock via Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Excel Stock Management</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="download">Download Stock Report</TabsTrigger>
            <TabsTrigger value="upload">Upload Stock Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download">
            <Card>
              <CardHeader>
                <CardTitle>Download Current Stock Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Download an Excel file with current product stock levels.
                  Update the stock values and upload back to the system.
                </p>
                <Button 
                  onClick={downloadStockReport} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating Report..." : "Download Stock Report"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Stock Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="excelFile">Updated Stock File</Label>
                  <Input 
                    id="excelFile" 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload your modified stock report Excel file.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Update Method</Label>
                  <RadioGroup 
                    value={updateMode} 
                    onValueChange={(value: "replace" | "add") => setUpdateMode(value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replace" id="replace-mode" />
                      <Label htmlFor="replace-mode">Replace current stock values</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="add" id="add-mode" />
                      <Label htmlFor="add-mode">Add to current stock values</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    Choose whether to replace current stock or add to it.
                  </p>
                </div>
                
                {uploadError && (
                  <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                    Error: {uploadError}
                  </div>
                )}
                
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={!file || isLoading}
                >
                  {isLoading ? "Processing..." : "Update Stock"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}