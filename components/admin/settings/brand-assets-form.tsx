'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  logoLight: z.string().optional(),
  logoDark: z.string().optional(),
  favicon: z.string().optional()
})

type BrandAssetsFormValues = z.infer<typeof formSchema>

export function BrandAssetsForm() {
  const form = useForm<BrandAssetsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoLight: '',
      logoDark: '',
      favicon: ''
    }
  })

  const handleUpload = (field: keyof BrandAssetsFormValues, value: string) => {
    form.setValue(field, value)
  }

  const handleRemove = (field: keyof BrandAssetsFormValues) => {
    form.setValue(field, '')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        toast.success('Brand assets saved!')
        console.log(data)
      })}>
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>Manage your store logos and brand assets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Mode Logo */}
              <FormField
                control={form.control}
                name="logoLight"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Light Mode Logo</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 h-40">
                        <div className="bg-muted rounded-md p-2 w-full h-full flex items-center justify-center">
                          <span className="font-bold text-xl">StyleShop</span>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => handleUpload('logoLight', 'mock-url')}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRemove('logoLight')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 200x60px. PNG or SVG format.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dark Mode Logo */}
              <FormField
                control={form.control}
                name="logoDark"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Dark Mode Logo</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 h-40 bg-slate-900">
                        <div className="bg-slate-800 rounded-md p-2 w-full h-full flex items-center justify-center">
                          <span className="font-bold text-xl text-white">StyleShop</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-slate-800 text-white hover:bg-slate-700"
                            onClick={() => handleUpload('logoDark', 'mock-url')}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-slate-800 text-destructive hover:bg-slate-700"
                            onClick={() => handleRemove('logoDark')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 200x60px. PNG or SVG format.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Favicon */}
            <FormField
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center w-20 h-20">
                        <span className="font-bold text-xl">S</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpload('favicon', 'mock-url')}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleRemove('favicon')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 32x32px. ICO, PNG or SVG format.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
