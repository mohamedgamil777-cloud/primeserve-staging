'use client'

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TierItem } from '@/types/tier'
import { insertTierSchema } from '@/db/schema/tiers'
import { useQueryClient } from '@tanstack/react-query'
import { updateTier } from '@/actions/tier'
import { toast } from 'sonner'


type TierFormValues = z.infer<typeof insertTierSchema>

type Props = {
  tier?:Partial<TierItem>
}

export default function TierCreator({ children, tier }: React.PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TierFormValues>({
    resolver: zodResolver(insertTierSchema),
    defaultValues: {
      id: tier?.id,
      name: tier?.name ?? '',
      color: tier?.color ?? '#000000',
      description: tier?.description ?? '',
      minPoints: tier?.minPoints ?? 0,
      maxPoints: tier?.maxPoints ?? 1000,
      pointsMultiplier: tier?.pointsMultiplier ?? 1,
      benefits: tier?.benefits?.join("\n") ?? "",
      isActive: tier?.isActive ?? true,
    },
  })

  useEffect(()=>{
    if(tier) form.reset({
      id: tier?.id,
      name: tier?.name ?? '',
      color: tier?.color ?? '#000000',
      description: tier?.description ?? '',
      minPoints: tier?.minPoints ?? 0,
      maxPoints: tier?.maxPoints ?? 1000,
      pointsMultiplier: tier?.pointsMultiplier ?? 1,
      benefits: tier?.benefits?.join("\n") ?? "",
      isActive: tier?.isActive ?? true,
    })
  },[tier])

  const onSubmit = async (data: TierFormValues) => {
    setIsLoading(true)  
    try {
      const res = await updateTier(data)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["tiers"]})
        toast.success(`The "${data.name}" tier has been ${data.id ? "updated" : "added"} successfully.`)
        form.reset()
        setIsOpen(false)
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsLoading(false)  
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tier?.id ? "Update" : "Add New"} Membership Tier</DialogTitle>
          <DialogDescription>
            {tier?.id ? "Update" : "Create a new"} membership tier with benefits
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Diamond" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe this tier..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="minPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsMultiplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Multiplier</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`1x points on purchases\nBirthday discount\nFree shipping`}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={isLoading}
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
              >
                {tier?.id ? "Update" : "Add"} Tier
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
