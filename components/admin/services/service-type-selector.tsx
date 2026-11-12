import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, FileText, Users, Zap } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

const serviceTypes = [
  {
    id: "commercial-av",
    name: "Commercial AV Installation",
    description: "Conference rooms, auditoriums, digital signage",
    icon: Building,
  },
  {
    id: "hvac-maintenance",
    name: "HVAC System Maintenance",
    description: "Commercial air conditioning and heating systems",
    icon: Zap,
  },
  {
    id: "network-setup",
    name: "Network Infrastructure",
    description: "Enterprise networking and IT infrastructure",
    icon: Users,
  },
  {
    id: "security-systems",
    name: "Security System Installation",
    description: "Surveillance cameras, access control, alarms",
    icon: Building,
  },
  {
    id: "custom-project",
    name: "Custom Project",
    description: "Specialized or unique service requirements",
    icon: FileText,
  },
]


export default function ServiceTypeSelector({}: Props) {
  const [selectedServiceType, setSelectedServiceType] = useState("")
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Type</CardTitle>
        <CardDescription>What type of service do you need?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((service) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedServiceType === service.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedServiceType(service.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="mt-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedServiceType === service.id ? "border-primary bg-primary" : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}