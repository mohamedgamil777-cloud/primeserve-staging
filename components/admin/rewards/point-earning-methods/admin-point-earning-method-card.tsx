import { togglePointEarningMethodActivation } from '@/actions/pointEarningMethod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { PointEarningMethod } from '@/types/pointEarningMethod'
import { useQueryClient } from '@tanstack/react-query'
import { Edit, MoreHorizontal, Trash2, TrendingUp } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import PointEarningMethodCreator from './point-earning-method-creator'
import PointEarningMethodDeleter from './point-earning-method-deleter'

type Props = {
  pointEarningMethod:PointEarningMethod
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "purchase":
      return "bg-green-100 text-green-800"
    case "review":
      return "bg-blue-100 text-blue-800"
    case "signup":
      return "bg-purple-100 text-purple-800"
    case "referral":
      return "bg-orange-100 text-orange-800"
    case "birthday":
      return "bg-pink-100 text-pink-800"
    case "social":
      return "bg-cyan-100 text-cyan-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "purchase":
      return "💰"
    case "review":
      return "⭐"
    case "signup":
      return "🎉"
    case "referral":
      return "👥"
    case "birthday":
      return "🎂"
    case "social":
      return "📱"
    default:
      return "🎯"
  }
}



export default function AdminPointEarningMethodCard({pointEarningMethod}: Props) {
  // For optimistic updates instead of using mutaions
  const [isActive, setIsActive] = useState(pointEarningMethod.isActive)
  const queryClient = useQueryClient()
  const editorRef = useRef<HTMLButtonElement>(null)
  const deletorRef = useRef<HTMLButtonElement>(null)
  const handleToggleActive = async () => {
    try {
      setIsActive(!isActive)
      const res = await togglePointEarningMethodActivation(pointEarningMethod.id,!isActive)
      if(res.error){
        toast.error(res.error)
        setIsActive(isActive)
      } 
      else{
        await queryClient.invalidateQueries({"queryKey":["point-earning-methods"]})
        toast.success(`Points Earning Method "${pointEarningMethod.name}" has been ${isActive ? "deactivated" : "activated"} successfully.`)
      }
    } catch (error) {
      setIsActive(isActive)
      toast.error("something went wrong, try again later.")
    }
  }
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="text-2xl">{getTypeIcon(pointEarningMethod.type)}</div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{pointEarningMethod.name}</h3>
            <Badge className={getTypeColor(pointEarningMethod.type)}>{pointEarningMethod.type}</Badge>
            <Badge variant={pointEarningMethod.isActive ? "default" : "secondary"}>
              {pointEarningMethod.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pointEarningMethod.description}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>
              {pointEarningMethod.pointsPerDollar
                ? `${pointEarningMethod.pointsPerDollar} pts per $1`
                : `${pointEarningMethod.pointsAwarded} points`}
            </span>
            <span>•</span>
            <span>{pointEarningMethod.frequency}</span>
            <span>•</span>
            <span>{pointEarningMethod.totalEarned.toLocaleString()} total earned</span>
          </div>
          {pointEarningMethod.conditions && <p className="text-xs text-muted-foreground italic">{pointEarningMethod.conditions}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-right mr-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{pointEarningMethod.totalEarned.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">points earned</p>
        </div>
        <PointEarningMethodCreator pointEarningMethod={pointEarningMethod}>
          <button ref={editorRef} className='hidden'>Edit</button>
        </PointEarningMethodCreator>
        <PointEarningMethodDeleter pointEarningMethod={pointEarningMethod}>
          <button ref={deletorRef} className='hidden'>Delete</button>
        </PointEarningMethodDeleter>
        <Switch checked={pointEarningMethod.isActive ?? false} onCheckedChange={() => handleToggleActive()} />
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
  )
}