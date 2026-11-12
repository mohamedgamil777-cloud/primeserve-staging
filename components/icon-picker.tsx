"use client"
import { useState } from "react"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { availableIcons, getIconComponent } from "@/db/lib/icons"


interface IconPickerProps {
  selectedIcon: string
  onIconSelect: (iconName: string) => void,
  label?:string,
  description?:string
}

export function IconPicker({ selectedIcon, onIconSelect, label, description }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const SelectedIcon = getIconComponent(selectedIcon)

  return (
    <div>
      {/* <Label>{label ?? "Category Icon"}</Label> */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <SelectedIcon className="mr-2 h-4 w-4" />
            {selectedIcon}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Icon</DialogTitle>
            <DialogDescription>{description ?? "Select an icon for this category"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
            {availableIcons.map((iconItem) => {
              const IconComponent = iconItem.icon
              return (
                <Button
                  key={iconItem.name}
                  variant={selectedIcon === iconItem.name ? "default" : "outline"}
                  size="sm"
                  className="h-12 w-12 p-0"
                  onClick={() => {
                    onIconSelect(iconItem.name)
                    setIsOpen(false)
                  }}
                >
                  <IconComponent className="h-5 w-5" />
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
