"use client"
import { utils, writeFile } from 'xlsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export async function exportToCSV(data: Array<Record<string, any>>, filename: string) {
  // CSV implementation
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
}

export async function exportToExcel(data: Array<Record<string, any>>, filename: string) {
  // Excel implementation
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  writeFile(workbook, `${filename}.xlsx`);
}


function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type ExportFormat = 'csv' | 'excel';

interface ExportButtonProps {
  data: Array<Record<string, any>>;
  filename: string;
  format: ExportFormat;
  disabled?: boolean;
}

export function ExportButton({ data, filename, format, disabled = false }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = {
    csv: isLoading ? 'Exporting CSV...' : 'Export as CSV',
    excel: isLoading ? 'Exporting Excel...' : 'Export as Excel',
    pdf: isLoading ? 'Exporting PDF...' : 'Export as PDF',
  }[format];

  const handleExport = async () => {
    if (!data.length || isLoading) return;

    setIsLoading(true);
    
    try {
      switch (format) {
        case 'csv':
          await exportToCSV(data, filename);
          break;
        case 'excel':
          await exportToExcel(data, filename);
          break;
        // case 'pdf':
        //   await exportToPDF(data, filename);
        //   break;
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isLoading || !data.length}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}