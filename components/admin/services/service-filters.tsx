import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Filter } from 'lucide-react'
import React from 'react'

type Props = {}

export default function ServiceFilters({}: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Filters</span>
            <Filter className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Service Type Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Service Type</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="repair" />
                <label htmlFor="repair" className="text-sm">
                  Repair
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="installation" defaultChecked />
                <label htmlFor="installation" className="text-sm">
                  Installation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="maintenance" />
                <label htmlFor="maintenance" className="text-sm">
                  Maintenance
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Price Range</h3>
            <Slider defaultValue={[0, 200]} min={0} max={500} step={10} />
            <div className="flex items-center justify-between">
              <span className="text-sm">EGP 0</span>
              <span className="text-sm">EGP 500+</span>
            </div>
          </div>

          <Separator />

          {/* Urgency Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Urgency</h3>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express">Express</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emergency" id="emergency" />
                <Label htmlFor="emergency">Emergency</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Rating</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="rating-4" defaultChecked />
                <label htmlFor="rating-4" className="text-sm">
                  4★ & above
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rating-3" />
                <label htmlFor="rating-3" className="text-sm">
                  3★ & above
                </label>
              </div>
            </div>
          </div>

          <Button className="w-full mt-2">Apply Filters</Button>
        </CardContent>
      </Card>
    </div>


  )
}