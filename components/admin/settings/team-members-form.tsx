"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { PlusCircle, Trash2, Upload } from "lucide-react"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { z } from "zod"
import { insertTeamMemberSchema, selectTeamMemberSchema, teamMembersSchema } from "@/db/schema/teamMembers"
import { ImageUpload } from "@/components/image-upload"
import { genStoreTeamMemberImageUrl } from "@/lib/store"
import { useState } from "react"
import { deleteStoreTeamMember, updateStoreTeamMembers } from "@/actions/store"


export type TeamMember = z.infer<typeof insertTeamMemberSchema>
export type TeamMembersFormValues = z.infer<typeof teamMembersSchema>


export function TeamMembersForm({ initialData }: { initialData: {"members":Pick<z.infer<typeof selectTeamMemberSchema>,"bio"|"id"|"image"|"name"|"role">[]} }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<TeamMembersFormValues>({
    resolver: zodResolver(teamMembersSchema),
    defaultValues: {
      "members":initialData.members.map(member=>({
        ...member,
        "image":""
      }))
    },
  })

  const fields = form.watch("members")
  const appendEmptyTeamMember = ()=> form.setValue("members",[...form.watch("members"),{id: "",name: "",role: "",bio: "",image: "",}])
  const removeTeamMember = (idx:number)=> form.setValue("members",form.watch("members").filter((_,_idx)=>_idx !== idx))


  const onSubmit = async (values: TeamMembersFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStoreTeamMembers({...values,"members":values.members.map(member=>({...member,"image":"",}))})
      if (res.error) toast.error(res.error)
      else if (res.success){
        //The following logic assumes that these arrays will remain in the order
        await Promise.all(values.members.map((member,idx)=>({
          "id":res.memberIds[idx],
          "image":member.image
          }))
          .filter(member=>!!member.image)
          .map(async member=>{
            const imageFormData = new FormData();
            imageFormData.append("image", member.image);
            await fetch(`/api/stores/team/${member.id}/media`, {
              method: "POST",
              body: imageFormData,
            })
          })
        )
        toast.success("Store Team Members settings saved successfully.")
      } 
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team member profiles displayed on the About page.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {fields.map((memberField, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      removeTeamMember(index)
                      toast.success("Team member removed!")
                      if(memberField.id) await deleteStoreTeamMember(memberField.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`members.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`members.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`members.${index}.bio`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} value={field.value ?? ""}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`members.${index}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image (Optional)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => form.setValue(`members.${index}.image`, "")}
                          aspectRatio="logo"
                          label="Upload Logo"
                          description="Drag and drop or click to upload your team member logo"
                          maxSizeMB={2}
                          defaultImgPreview={initialData.members.find(mem=>mem.id === memberField.id)?.image ? genStoreTeamMemberImageUrl(initialData.members.find(mem=>mem.id === memberField.id)?.image) : undefined}
                        />
                      </FormControl>
                      <FormDescription>Recommended size: 400x400px. PNG or JPG format.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              disabled={isLoading}
              onClick={() =>
                appendEmptyTeamMember()
              }
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
