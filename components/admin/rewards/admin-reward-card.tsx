import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { RewardItem } from '@/types/reward'
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import RewardCreator from './reward-creator'
import RewardDeleter from './reward-deleter'
import { toggleRewardActivation } from '@/actions/reward'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  reward:RewardItem
}


const getTypeColor = (type: string) => {
  switch (type) {
    case "discount":
      return "bg-green-100 text-green-800"
    case "shipping":
      return "bg-blue-100 text-blue-800"
    case "access":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}


export default function AdminRewardCard({reward}: Props) {
  // For optimistic updates instead of using mutaions
  const [isActive, setIsActive] = useState(reward.isActive)
  const queryClient = useQueryClient()
  const editorRef = useRef<HTMLButtonElement>(null)
  const deletorRef = useRef<HTMLButtonElement>(null)
  const handleToggleActive = async (rewardId: string) => {
    try {
      setIsActive(!isActive)
      const res = await toggleRewardActivation(reward.id,!isActive)
      if(res.error){
        toast.error(res.error)
        setIsActive(isActive)
      } 
      else{
        await queryClient.invalidateQueries({"queryKey":["rewards"]})
        toast.success(`reward "${reward.name}" has been ${isActive ? "deactivated" : "activated"} successfully.`)
      }
    } catch (error) {
      setIsActive(isActive)
      toast.error("something went wrong, try again later.")
    }
  }
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{reward.name}</h3>
          <Badge className={getTypeColor(reward.type)}>{reward.type}</Badge>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{reward.description}</p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>{reward.pointsCost} points</span>
          <span>•</span>
          <span>{reward.redeemed} redeemed</span>
          {reward.minPurchase > 0 && (
            <>
              <span>•</span>
              <span>Min. EGP {reward.minPurchase}</span>
            </>
          )}
          <span>•</span>
          <span>Expires in {reward.expiryDays} days</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RewardCreator reward={reward}>
          <button ref={editorRef} className='hidden'>Edit</button>
        </RewardCreator>
        <RewardDeleter reward={reward}>
          <button ref={deletorRef} className='hidden'>Delete</button>
        </RewardDeleter>
        <Switch checked={isActive ?? false} onCheckedChange={() => handleToggleActive(reward.id)} />
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
            {/* <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem> */}
            <DropdownMenuItem className="text-red-600" onClick={() => deletorRef.current?.click()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>   
  )
}