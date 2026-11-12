'use client'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddBranchDialog } from './add-branch-dialog'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { EmptySearchResults } from '@/components/empty-states/empty-search-results'

const hourOptions = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
})

const businessHourSchema = z.object({
  day: z.string(),
  isOpen: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional()
})

const formSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  isActive: z.boolean(),
  address: z.string().optional(),
  businessHours: z.array(businessHourSchema)
})

type FormValues = z.infer<typeof formSchema>

export function StoreBranchesForm({
  branches,
}: {
  branches: any[]
}) {
  const [selectedBranch, setSelectedBranch] = useState<any>({})
  const handleDeleteBranch = (id:string) => {
    if (branches.length <= 1) {
      toast.error("You must have at least one branch")
      return
    }

    const newBranches = branches.filter((branch) => branch.id !== id)
    // setBranches(newBranches)
    // setSelectedBranch(newBranches[0])
    toast.success("Branch deleted successfully!")
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...selectedBranch
    }
  })

  useEffect(()=>{
    if(selectedBranch) form.reset(selectedBranch)
  },[selectedBranch])

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Store Branches</h2>
        <AddBranchDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </AddBranchDialog>
      </div>

      {
        branches.length === 0
        ?
        <div className=' flex flex-col items-center'>
          <EmptySearchResults
            className=' pb-0' 
            title='No Branches' 
            description='You have not registered any physical branches yet, start by adding your first branch' 
          />
          <AddBranchDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </AddBranchDialog>
        </div>
        :
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Branch List</h3>
              <div className="space-y-2">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedBranch.id === branch.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted-foreground/10'
                      }`}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">{branch.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteBranch(branch.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Branch Details: {selectedBranch.name}</CardTitle>
              <CardDescription>Manage branch information and business hours.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => {
                  console.log('Submit', data)
                })}
              >
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 self-end">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>Branch is active</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Business Hours</h3>
                    <div className="space-y-4">
                      {form.watch('businessHours')?.map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <FormField
                            control={form.control}
                            name={`businessHours.${index}.isOpen`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>{form.watch(`businessHours.${index}.day`)}</FormLabel>
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`businessHours.${index}.openTime`}
                              render={({ field }) => (
                                <Select
                                  value={field.value || ''}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[110px]">
                                      <SelectValue placeholder="Opening" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {hourOptions.map((h) => (
                                      <SelectItem key={h} value={h}>
                                        {h}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <span>to</span>
                            <FormField
                              control={form.control}
                              name={`businessHours.${index}.closeTime`}
                              render={({ field }) => (
                                <Select
                                  value={field.value || ''}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[110px]">
                                      <SelectValue placeholder="Closing" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {hourOptions.map((h) => (
                                      <SelectItem key={h} value={h}>
                                        {h}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      }
    </>
  )
}
