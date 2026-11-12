"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Bell, Lock, Shield, User } from 'lucide-react'
import CustomerPasswordForm from './customer-password-form'
import CustomerDeleteAccountSection from './customer-delete-account-section'
// import CustomerPrivacySettings from './customer-privacy-settings'
import CustomerEmailPreferences from './customer-email-preferences'
import CustomerPersonalInfoForm from './customer-personal-info-form'
import { z } from 'zod'
import { updateUserSchema } from '@/db/schema/users'
import { UserPreferences } from '@/types/userPreference'
import { useTranslations } from 'next-intl'

type Props = {
  userPersonalInfo:z.infer<typeof updateUserSchema>,
  userPreferences:UserPreferences
}

export default function CustomerSettings({userPersonalInfo,userPreferences}: Props) {
  const t = useTranslations()
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {t('personal')}
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {t('security')}
        </TabsTrigger>
        {/* <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Privacy
        </TabsTrigger> */}
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          {t('email')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <CustomerPersonalInfoForm personalInfo={userPersonalInfo}/>
      </TabsContent>

      <TabsContent value="security">
        <CustomerPasswordForm/>
        <CustomerDeleteAccountSection/>
      </TabsContent>
{/* 
      <TabsContent value="privacy">
        <CustomerPrivacySettings privacyPreferences={userPreferences}/>
      </TabsContent> */}

      <TabsContent value="email">
        <CustomerEmailPreferences emailPrefs={userPreferences}/>
      </TabsContent>
    </Tabs>
  )
}