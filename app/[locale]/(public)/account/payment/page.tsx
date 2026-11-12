"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Star, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomerPaymentMethodsEmpty } from "@/components/empty-states/customer-empty-states"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

// Mock data for payment methods
const initialPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    holderName: "John Doe",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "06",
    expiryYear: "2026",
    holderName: "John Doe",
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  const t = useTranslations()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<any>(null)

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
  })

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  const getCardBrand = (type: string) => {
    switch (type) {
      case "visa":
        return t('visa')
      case "mastercard":
        return t('mastercard')
      case "amex":
        return t('american-express')
      default:
        return t('card')
    }
  }

  const handleAddPaymentMethod = () => {
    const newMethod = {
      id: Date.now().toString(),
      type: "visa", // This would be determined by the card number
      last4: newPaymentMethod.cardNumber.slice(-4),
      expiryMonth: newPaymentMethod.expiryMonth,
      expiryYear: newPaymentMethod.expiryYear,
      holderName: newPaymentMethod.holderName,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods((prev) => [...prev, newMethod])
    setNewPaymentMethod({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: t('payment-method-added'),
      description: t('your-new-payment-method-has-been-saved-successfully'),
    })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: t('default-payment-method-updated'),
      description: t('your-default-payment-method-has-been-changed'),
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    const methodToDelete = paymentMethods.find((m) => m.id === id)
    const remainingMethods = paymentMethods.filter((method) => method.id !== id)

    // If we're deleting the default method and there are other methods, make the first one default
    if (methodToDelete?.isDefault && remainingMethods.length > 0) {
      remainingMethods[0].isDefault = true
    }

    setPaymentMethods(remainingMethods)

    toast({
      title: t('payment-method-deleted'),
      description: t('the-payment-method-has-been-removed-from-your-account'),
    })
  }

  const handleEditPaymentMethod = (method: any) => {
    setEditingMethod(method)
    setIsEditDialogOpen(true)
  }

  if (paymentMethods.length === 0) {
    return <CustomerPaymentMethodsEmpty />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('payment-methods')}</h1>
          <p className="text-muted-foreground">{t('manage-your-saved-payment-methods-for-faster-checkout')}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('add-payment-method')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('add-payment-method')}</DialogTitle>
              <DialogDescription>{t('add-a-new-credit-or-debit-card-to-your-account')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t('card-number')}</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newPaymentMethod.cardNumber}
                  onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">{t('month')}</Label>
                  <Select
                    value={newPaymentMethod.expiryMonth}
                    onValueChange={(value) => setNewPaymentMethod((prev) => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">{t('year')}</Label>
                  <Select
                    value={newPaymentMethod.expiryYear}
                    onValueChange={(value) => setNewPaymentMethod((prev) => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={newPaymentMethod.cvv}
                    onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="holderName">{t('cardholder-name')}</Label>
                <Input
                  id="holderName"
                  placeholder={t('john-doe')}
                  value={newPaymentMethod.holderName}
                  onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, holderName: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleAddPaymentMethod}>{t('add-payment-method')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-lg">
                    {getCardIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {getCardBrand(method.type)} •••• {method.last4}
                      </h3>
                      {method.isDefault && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {t('default')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('expires')} {method.expiryMonth}/{method.expiryYear} • {method.holderName}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!method.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {t('set-as-default')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleEditPaymentMethod(method)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeletePaymentMethod(method.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
