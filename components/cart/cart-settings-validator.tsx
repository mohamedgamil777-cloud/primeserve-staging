"use client"
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

interface Props {
  children: React.ReactNode;
  onProceed: () => void;
  minPurchaseAmount?: number|null;
  maxPurchaseAmount?: number|null;
  minItemsPerOrder?: number|null;
  maxItemsPerOrder?: number|null;
  currentTotal: number;
  currentItemCount: number;
}

export function CartSettingsValidator({
  children,
  onProceed,
  minPurchaseAmount,
  maxPurchaseAmount,
  minItemsPerOrder,
  maxItemsPerOrder,
  currentTotal,
  currentItemCount,
}: Props) {
  const t = useTranslations()
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCheckout = () => {
    // Reset previous errors
    setError(null);

    // Validate minimum purchase amount
    if (!!minPurchaseAmount && currentTotal < minPurchaseAmount) {
      setError(`Minimum order amount is $${minPurchaseAmount.toFixed(2)}`);
      return false;
    }

    // Validate maximum purchase amount
    if (!!maxPurchaseAmount && currentTotal > maxPurchaseAmount) {
      setError(`Maximum order amount is $${maxPurchaseAmount.toFixed(2)}`);
      return false;
    }

    // Validate minimum items per order
    if (!!minItemsPerOrder && currentItemCount < minItemsPerOrder) {
      setError(`Minimum ${minItemsPerOrder} item${minItemsPerOrder !== 1 ? 's' : ''} per order`);
      return false;
    }

    // Validate maximum items per order
    if (!!maxItemsPerOrder && currentItemCount > maxItemsPerOrder) {
      setError(`Maximum ${maxItemsPerOrder} item${maxItemsPerOrder !== 1 ? 's' : ''} per order`);
      return false;
    }

    return true;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      if (validateCheckout()) {
        onProceed();
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('order-requirements-not-met')}</AlertDialogTitle>
          <AlertDialogDescription>
            {error ? (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              t('please-review-your-order-before-proceeding-to-checkout')
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('continue-shopping')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              if (validateCheckout()) {
                onProceed();
                setOpen(false);
              }
            }}
            disabled={!!error}
          >
            {t('proceed-anyway')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}