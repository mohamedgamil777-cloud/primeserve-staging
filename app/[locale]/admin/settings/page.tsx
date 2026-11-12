import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreDisplaySettingsForm } from "@/components/admin/settings/store-display-settings-form"
import { StoreInformationForm } from "@/components/admin/settings/store-information-form"
import { StorePrivacyPolicyForm } from "@/components/admin/settings/store-privacy-policy-form"
import { StoreFaqsForm } from "@/components/admin/settings/store-faqs-form"
import { StoreContactInfoForm } from "@/components/admin/settings/store-contact-info-form"
import { TeamMembersForm } from "@/components/admin/settings/team-members-form"
import { StoreAboutPageForm } from "@/components/admin/settings/store-about-page-form"
import { StoreShippingForm } from "@/components/admin/settings/store-shipping-form"
import { StoreBranchesForm } from "@/components/admin/settings/store-branches-form"
import CustomerPersonalInfoForm from "@/components/settings/customer-personal-info-form"
import CustomerPasswordForm from "@/components/settings/customer-password-form"
import { BrandAssetsForm } from "@/components/admin/settings/brand-assets-form"
import { StoreHeroSectionForm } from "@/components/admin/settings/store-hero-section-form"
import { StoreSocialMediaForm } from "@/components/admin/settings/store-social-media-form"
import { StorePaymentMethodsForm } from "@/components/admin/settings/store-payment-methods-form"
import { StoreTaxSettingsForm } from "@/components/admin/settings/store-tax-settings-form"
import { db } from "@/db"
import { getSession } from "@/lib/auth-server"
import { getTenantId } from "@/lib/tenant"
import { redirect } from "next/navigation"
import RedirectToDashboard from "@/components/common/redirect-to-dashboard"
import { DEFAULT_PRIVECY_POLICY } from "@/data/privacyPolicy"
import { DEFAULT_FAQ_CATEGORIES } from "@/data/faqCategories"
import { StoreCartSettingsForm } from "@/components/admin/settings/store-cart-settings-form"
import { StoreEmailProviderConfigForm } from "@/components/admin/settings/store-email-provider-config-form"
import { StoreCustomerNotificationsConfigForm } from "@/components/admin/settings/store-customer-notifications-config-form"
import { StoreAdminNotificationsConfigForm } from "@/components/admin/settings/store-admin-notifications-config-form"
import { StoreAuthSupportSettingsForm } from "@/components/admin/settings/store-auth-support-settings-form"
import { validateResendApiKey } from "@/types/mail"

export default async function AdminSettingsPage() {
  const [session,storeId] = await Promise.all([
    getSession(),
    getTenantId()
  ]) 
  if(!session?.user_id) redirect("/auth/login")
  if(session.user_role !== "seller") return <RedirectToDashboard role={session.user_role}/>

  const [
    userPersonalInfo,
    storeInfo,
  ] = await Promise.all([
    db.query.users.findFirst({
      "columns":{
        "firstName":true,
        "lastName":true,
        "email":true,
        "phone":true
      },
      "where":(users,{eq})=>eq(users.id,session.user_id),
    }),
    db.query.stores.findFirst({
      "where":(stores,{eq})=>eq(stores.id,storeId),
      "columns":{
        name: true,
        storeCurrency: true,
        description:  true,
        legalName: true,
        taxId: true,
      },
      "with":{
        "storeDisplaySettings":true,
        "privacyPolicy":true,
        "faqCategories":{
          "with":{
            "faqs":true,
          }
        },
        "storePaymentMethods":true,
        "storeTaxSettings":true,
        "storeShippingMethods":true,
        "aboutPageContent":true,
        "contactInformation":true,
        "teamMembers":true,
        "cartSettings":true,
        "storeAssets":true,
        "emailPreferences":true,
      },
    }),
  ]) 

  const isValidApiKey = validateResendApiKey(storeInfo?.emailPreferences?.resendApiKey)

  const branches = [
    {
      id: "1",
      name: "Main Store",
      address: "123 Commerce St, Suite 100, Shopville, CA 90210",
      phone: "+1 (555) 123-4567",
      email: "mainstore@example.com",
      isActive: true,
      businessHours: [
        { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
        { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
        { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
        { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
        { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
        { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "15:00" },
        { day: "Sunday", isOpen: false, openTime: "closed", closeTime: "closed" },
      ],
    },
    {
      id: "2",
      name: "Downtown Branch",
      address: "456 Main St, Downtown, CA 90211",
      phone: "+1 (555) 987-6543",
      email: "downtown@example.com",
      isActive: true,
      businessHours: [
        { day: "Monday", isOpen: true, openTime: "10:00", closeTime: "18:00" },
        { day: "Tuesday", isOpen: true, openTime: "10:00", closeTime: "18:00" },
        { day: "Wednesday", isOpen: true, openTime: "10:00", closeTime: "18:00" },
        { day: "Thursday", isOpen: true, openTime: "10:00", closeTime: "18:00" },
        { day: "Friday", isOpen: true, openTime: "10:00", closeTime: "20:00" },
        { day: "Saturday", isOpen: true, openTime: "11:00", closeTime: "16:00" },
        { day: "Sunday", isOpen: false, openTime: "closed", closeTime: "closed" },
      ],
    },
  ]

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your store settings and preferences.</p>
        </div>
        {/* <Button onClick={() => toast.success("Settings saved successfully!")}>Save All Changes</Button> */}
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid grid-cols-8 w-full md:w-auto">
          <TabsTrigger value="store">Store</TabsTrigger>
          {/* <TabsTrigger value="branches">Branches</TabsTrigger> */}
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6 mt-6">
          <StoreInformationForm initialData={storeInfo}/>
          <StoreDisplaySettingsForm initialData={storeInfo?.storeDisplaySettings ?? undefined}/>
          <StoreCartSettingsForm initialData={storeInfo?.cartSettings ?? undefined}/>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6 mt-6">
          <StoreBranchesForm 
            branches={branches} 
          />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          {/* <BrandAssetsForm/> */}
          <StoreHeroSectionForm initialData={storeInfo?.storeAssets}/>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 mt-6">
          <CustomerPersonalInfoForm personalInfo={userPersonalInfo}/>
          <CustomerPasswordForm/>          
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 mt-6">
          <StorePaymentMethodsForm initialData={storeInfo?.storePaymentMethods.reduce((acc,cur)=>({...acc,[cur["method"]]:cur["enabled"] as any}),{})}/>
          <StoreTaxSettingsForm initialData={storeInfo?.storeTaxSettings}/>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6 mt-6">
          <StoreShippingForm initialData={storeInfo?.storeShippingMethods.reduce((acc,cur)=>({...acc,[cur["method"]]:{"enabled":cur["enabled"],"cost":cur["price"] ?? 0} as any}),{})}/>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 mt-6">
          <StoreAboutPageForm initialData={storeInfo?.aboutPageContent}/>
          <StoreContactInfoForm initialData={storeInfo?.contactInformation}/>
          <StoreSocialMediaForm initialData={storeInfo?.contactInformation}/>
          <TeamMembersForm initialData={{"members":storeInfo?.teamMembers ?? []}}/>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <StoreEmailProviderConfigForm initialData={storeInfo?.emailPreferences}/>
          <StoreAdminNotificationsConfigForm 
            initialData={storeInfo?.emailPreferences} 
            isApiKeyValid={isValidApiKey}
          />
          <StoreCustomerNotificationsConfigForm 
            initialData={storeInfo?.emailPreferences} 
            isApiKeyValid={isValidApiKey}
          />
          <StoreAuthSupportSettingsForm 
            initialData={storeInfo?.emailPreferences} 
            isApiKeyValid={isValidApiKey}
          />
        </TabsContent>

        <TabsContent value="legal" className="space-y-6 mt-6">
          <StoreFaqsForm initialData={{categories:(!storeInfo?.faqCategories || storeInfo?.faqCategories.length === 0) ? DEFAULT_FAQ_CATEGORIES : storeInfo?.faqCategories}}/>
          <StorePrivacyPolicyForm initialData={storeInfo?.privacyPolicy.at(0) ?? DEFAULT_PRIVECY_POLICY}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
