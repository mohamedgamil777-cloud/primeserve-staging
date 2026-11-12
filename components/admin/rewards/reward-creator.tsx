'use client'

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PropsWithChildren, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { insertRewardSchema, rewardTypesMap } from '@/db/schema/rewards'
import { RewardItem } from '@/types/reward'
import { useQueryClient } from '@tanstack/react-query'
import { updateReward } from '@/actions/reward'


type RewardFormValues = z.infer<typeof insertRewardSchema>
type Props = {
  reward?:Partial<RewardItem>
}


export default function RewardCreator({reward,children}:PropsWithChildren<Props>) {
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(insertRewardSchema),
    defaultValues: {
      id: reward?.id,
      name: reward?.name ?? '',
      pointsCost: reward?.pointsCost ?? 0,
      description: reward?.description ?? '',
      type: reward?.type ?? 'discount',
      value: reward?.value ?? 0,
      minPurchase: reward?.minPurchase ?? 0,
      expiryDays: reward?.expiryDays ?? 30,
      isActive: reward?.isActive ?? true,
    },
  })

  useEffect(()=>{
    if(reward) form.reset({
      id: reward?.id,
      name: reward?.name ?? '',
      pointsCost: reward?.pointsCost ?? 0,
      description: reward?.description ?? '',
      type: reward?.type ?? 'discount',
      value: reward?.value ?? 0,
      minPurchase: reward?.minPurchase ?? 0,
      expiryDays: reward?.expiryDays ?? 30,
      isActive: reward?.isActive ?? true,
    })
  },[reward])

  const onSubmit = async (data: RewardFormValues) => {
    setIsLoading(true)  
    try {
      const res = await updateReward(data)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["rewards"]})
        toast.success(`The "${data.name}" reward has been ${data.id ? "updated" : "added"} successfully.`)
        form.reset()
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsLoading(false)  
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        {
          children 
          ??
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reward
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Reward</DialogTitle>
          <DialogDescription>Create a new reward for your loyalty program</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Name</FormLabel>
                    <FormControl><Input placeholder="e.g., $5 Off Next Purchase" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
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
                  <FormControl><Textarea placeholder="Describe the reward..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className=' w-full'>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          Object.entries(rewardTypesMap)
                            .map(rt=>(
                              <SelectItem value={rt[0]}>{rt[1]}</SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minPurchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="25.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isLoading} type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">{reward?.id ? "update" : "Add"} Reward</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
