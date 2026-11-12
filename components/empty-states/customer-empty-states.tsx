"use client"
import { EmptyState } from "@/components/empty-states/empty-state"
import { ShoppingBag, Heart, MapPin, CreditCard, Clock, MessageSquare, Bell, Gift } from "lucide-react"
import { useTranslations } from "next-intl"

export function CustomerOrdersEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={ShoppingBag}
      title={t('no-orders-yet')}
      description={t('you-havent-placed-any-orders-yet-start-shopping-to-see-your-orders-here')}
      actions={{
        primary: {
          label: t('browse-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function CustomerWishlistEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Heart}
      title={t('your-wishlist-is-empty')}
      description={t('save-items-you-love-to-your-wishlist-well-notify-you-if-they-go-on-sale')}
      actions={{
        primary: {
          label: t('browse-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function CustomerAddressesEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={MapPin}
      title={t('no-addresses-saved')}
      description={t('you-havent-saved-any-shipping-or-billing-addresses-yet')}
      actions={{
        primary: {
          label: t('add-address'),
          href: "/account/addresses/new",
        },
      }}
    />
  )
}

export function CustomerPaymentMethodsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={CreditCard}
      title={t('no-payment-methods')}
      description={t('you-havent-saved-any-payment-methods-yet-add-a-payment-method-for-faster-checkout')}
      actions={{
        primary: {
          label: t('add-payment-method'),
          href: "/account/payment-methods/new",
        },
      }}
    />
  )
}

export function CustomerRecentlyViewedEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Clock}
      title={t('no-recently-viewed-products')}
      description={t('products-you-view-will-appear-here-for-easy-access')}
      actions={{
        primary: {
          label: t('browse-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function CustomerReviewsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={MessageSquare}
      title={t('no-reviews-yet')}
      description={t('you-havent-reviewed-any-products-yet-your-reviews-help-other-shoppers-make-better-decisions')}
      actions={{
        primary: {
          label: t('view-orders'),
          href: "/account/orders",
        },
      }}
    />
  )
}

export function CustomerNotificationsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Bell}
      title={t('no-notifications')}
      description={t('you-dont-have-any-notifications-at-the-moment-well-notify-you-about-orders-promotions-and-more')}
      actions={{
        primary: {
          label: t('view-settings'),
          href: "/account/settings",
        },
      }}
    />
  )
}

export function CustomerRewardsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Gift}
      title={t('no-rewards-yet')}
      description={t('you-havent-earned-any-rewards-yet-shop-more-to-earn-points-and-unlock-special-offers')}
      actions={{
        primary: {
          label: t('learn-more'),
          href: "/rewards",
        },
        secondary: {
          label: t('shop-now'),
          href: "/products",
        },
      }}
    />
  )
}
