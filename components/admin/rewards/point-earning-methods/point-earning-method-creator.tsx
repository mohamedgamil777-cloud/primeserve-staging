'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
} from 'react-hook-form'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { PointEarningMethod } from '@/types/pointEarningMethod'
import { Plus } from 'lucide-react'
import { insertPointEarningMethodSchema, pointEarningMethodFrequencies, pointEarningMethodTypes } from '@/db/schema/pointEarningMethods'
import { useQueryClient } from '@tanstack/react-query'
import { updatePointEarningMethod } from '@/actions/pointEarningMethod'
import { toast } from 'sonner'

type FormValues = z.infer<typeof insertPointEarningMethodSchema>

type Props = {
  pointEarningMethod?: Partial<PointEarningMethod>
}

export default function PointEarningMethodCreator({ pointEarningMethod, children }: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(insertPointEarningMethodSchema),
    defaultValues: {
      id: pointEarningMethod?.id,
      name: pointEarningMethod?.name ?? '',
      type: pointEarningMethod?.type ?? "purchase",
      description: pointEarningMethod?.description ?? '',
      pointsAwarded: pointEarningMethod?.pointsAwarded ?? 0,
      pointsPerDollar: pointEarningMethod?.pointsPerDollar ?? 0,
      frequency: pointEarningMethod?.frequency ?? "unlimited",
      conditions: pointEarningMethod?.conditions ?? '',
      isActive: pointEarningMethod?.isActive ?? true,
    },
  })

  useEffect(()=>{
    if(pointEarningMethod) form.reset({
      id: pointEarningMethod?.id,
      name: pointEarningMethod?.name ?? '',
      type: pointEarningMethod?.type ?? "purchase",
      description: pointEarningMethod?.description ?? '',
      pointsAwarded: pointEarningMethod?.pointsAwarded ?? 50,
      pointsPerDollar: pointEarningMethod.pointsPerDollar ?? 0,
      frequency: pointEarningMethod?.frequency ?? "unlimited",
      conditions: pointEarningMethod?.conditions ?? '',
      isActive: pointEarningMethod?.isActive ?? true,
    })
  },[pointEarningMethod])

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)  
    try {
      const res = await updatePointEarningMethod(values)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["point-earning-methods"]})
        toast.success(`The "${values.name}" tier has been ${values.id ? "updated" : "added"} successfully.`)
        form.reset()
        setOpen(false)
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsLoading(false)  
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          children
          ??
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {pointEarningMethod?.id ? 'Edit Method' : 'Add Method'}
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {pointEarningMethod ? 'Update Earning Method' : 'Add New Earning Method'}
          </DialogTitle>
          <DialogDescription>
            {pointEarningMethod
              ? 'Edit the way customers earn points'
              : 'Create a new way for customers to earn points'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit,(err)=>console.log(err))} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Newsletter Signup" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className=' w-full'>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pointEarningMethodTypes.map(value => (
                          <SelectItem key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormControl>
                    <Textarea placeholder="Describe how customers earn points..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {
                form.watch("type") === "purchase"
                ?
                <FormField
                  control={form.control}
                  name="pointsPerDollar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Per Currency Unit</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                :
                <FormField
                  control={form.control}
                  name="pointsAwarded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Awarded</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value!}>
                      <FormControl>
                        <SelectTrigger className=' w-full'>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pointEarningMethodFrequencies.map(value => (
                          <SelectItem key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any conditions or requirements..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="mb-0">Active</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isLoading} type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {pointEarningMethod ? 'Update Method' : 'Add Method'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
