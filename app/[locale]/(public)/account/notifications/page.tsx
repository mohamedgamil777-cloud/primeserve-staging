"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Package, Tag, CreditCard, Heart, CheckCircle, Clock, X } from "lucide-react"
import { CustomerNotificationsEmpty } from "@/components/empty-states/customer-empty-states"
import { useTranslations } from "next-intl"

// No real notifications feed yet, so the page shows its empty state instead of sample items
const notifications: { id: string; type: string; title: string; message: string; timestamp: string; read: boolean; icon: typeof Package }[] = []

const notificationSettings = [
  {
    id: "order_updates",
    label: "order_updates.label",
    description: "order_updates.description",
    enabled: true,
  },
  {
    id: "promotions",
    label: "promotions.label",
    description: "promotions.description",
    enabled: true,
  },
  {
    id: "wishlist_alerts",
    label: "wishlist_alerts.label",
    description: "wishlist_alerts.description",
    enabled: false,
  },
  {
    id: "newsletter",
    label: "newsletter.label",
    description: "newsletter.description",
    enabled: true,
  },
  {
    id: "security",
    label: "security.label",
    description: "security.description",
    enabled: true,
  },
]

export default function NotificationsPage() {
  const t = useTranslations()
  const [notificationList, setNotificationList] = useState(notifications)
  const [settings, setSettings] = useState(notificationSettings)

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const unreadCount = notificationList.filter((n) => !n.read).length

  if (notificationList.length === 0) {
    return <CustomerNotificationsEmpty />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications')}</h1>
          <p className="text-muted-foreground">{t('manage-your-notifications-and-preferences')}</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            {t('mark-all-as-read')}
          </Button>
        )}
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('notifications')}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notificationList.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                {t('new')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t('notification-preferences')}</CardTitle>
              <CardDescription>{t('choose-what-notifications-you-want-to-receive')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.map((setting, index) => (
                <div key={setting.id}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={setting.id}>{t(`notifSettings.${setting.label}`)}</Label>
                      <p className="text-sm text-muted-foreground">{t(`notifSettings.${setting.description}`)}</p>
                    </div>
                    <Switch
                      id={setting.id}
                      checked={setting.enabled}
                      onCheckedChange={() => toggleSetting(setting.id)}
                    />
                  </div>
                  {index < settings.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
