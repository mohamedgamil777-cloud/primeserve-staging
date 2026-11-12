import { toggleTierActivation } from '@/actions/tier'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { TierItem } from '@/types/tier'
import { useQueryClient } from '@tanstack/react-query'
import { Edit, MoreHorizontal, Trash2, Users } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import TierCreator from './tier-creator'
import TierDeleter from './tier-deleter'

type Props = {
  tier:TierItem
}

export default function AdminTierCard({tier}: Props) {
  // For optimistic updates instead of using mutaions
  const [isActive, setIsActive] = useState(tier.isActive)
  const queryClient = useQueryClient()
  const editorRef = useRef<HTMLButtonElement>(null)
  const deletorRef = useRef<HTMLButtonElement>(null)
  const handleToggleActive = async () => {
    try {
      setIsActive(!isActive)
      const res = await toggleTierActivation(tier.id,!isActive)
      if(res.error){
        toast.error(res.error)
        setIsActive(isActive)
      } 
      else{
        await queryClient.invalidateQueries({"queryKey":["tiers"]})
        toast.success(`tier "${tier.name}" has been ${isActive ? "deactivated" : "activated"} successfully.`)
      }
    } catch (error) {
      setIsActive(isActive)
      toast.error("something went wrong, try again later.")
    }
  }
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: tier.color }} />
          <div>
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
          <Badge variant={tier.isActive ? "default" : "secondary"}>
            {tier.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <TierCreator tier={tier}>
            <button ref={editorRef} className='hidden'>Edit</button>
          </TierCreator>
          <TierDeleter tier={tier}>
            <button ref={deletorRef} className='hidden'>Delete</button>
          </TierDeleter>
          <Switch checked={tier.isActive ?? false} onCheckedChange={handleToggleActive} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={()=>editorRef.current?.click()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>deletorRef.current?.click()} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Points Range</p>
          <p className="text-sm text-muted-foreground">
            {tier.minPoints.toLocaleString()} - {tier.maxPoints ? tier.maxPoints.toLocaleString() : "∞"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Points Multiplier</p>
          <p className="text-sm text-muted-foreground">{tier.pointsMultiplier}x</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Members</p>
          </div>
          <p className="text-sm text-muted-foreground">{tier.memberCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Benefits</p>
        <div className="flex flex-wrap gap-2">
          {tier.benefits.map((benefit, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {benefit}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}