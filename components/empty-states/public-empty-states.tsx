"use client"
import { Search, ShoppingBag, FolderTree, Filter, Tag, MessageSquare } from "lucide-react"
import { EmptyState } from "./empty-state"
import { useTranslations } from "next-intl"

export function PublicSearchEmpty({ query }: { query?: string }) {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Search}
      title={t('no-results-found')}
      description={
        query
          ? `We couldn't find any products matching "${query}". Try different keywords or browse our categories.`
          : t('no-products-match-your-search-criteria-try-adjusting-your-filters-or-search-terms')
      }
      actions={{
        primary: {
          label: t('browse-all-products'),
          href: "/products",
        },
        secondary: {
          label: t('view-categories'),
          href: "/categories",
        },
      }}
    />
  )
}

export function PublicProductsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={ShoppingBag}
      title={t('no-products-found')}
      description={t('we-couldnt-find-any-products-matching-your-criteria-try-adjusting-your-filters-or-browse-our-categories')}
      actions={{
        primary: {
          label: t('clear-filters'),
          onClick: () => (window.location.href = window.location.pathname),
        },
        secondary: {
          label: t('view-categories'),
          href: "/categories",
        },
      }}
    />
  )
}

export function PublicServicesEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={FolderTree}
      title={t('no-services-found')}
      description={t('we-couldnt-find-any-services-matching-your-search-try-different-keywords-or-browse-all-services')}
      actions={{
        primary: {
          label: t('browse-all-services'),
          href: "/services",
        },
      }}
    />
  )
}

export function PublicCategoriesEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={FolderTree}
      title={t('no-categories-found')}
      description={t('we-couldnt-find-any-categories-matching-your-search-try-different-keywords-or-browse-all-products')}
      actions={{
        primary: {
          label: t('browse-all-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function PublicFilteredProductsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Filter}
      title={t('no-matching-products')}
      description={t('no-products-match-your-selected-filters-try-adjusting-your-filter-criteria-or-browse-all-products')}
      actions={{
        primary: {
          label: t('clear-filters'),
          onClick: () => (window.location.href = window.location.pathname),
        },
        secondary: {
          label: t('browse-all-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function PublicOutOfStockEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={Tag}
      title={t('out-of-stock')}
      description={t('this-product-is-currently-out-of-stock-check-back-later-or-browse-similar-products')}
      actions={{
        primary: {
          label: t('notify-me'),
          onClick: () => alert(t('youll-be-notified-when-this-product-is-back-in-stock')),
        },
        secondary: {
          label: t('similar-products'),
          href: "/products",
        },
      }}
    />
  )
}

export function PublicReviewsEmpty() {
  const t = useTranslations()
  return (
    <EmptyState
      icon={MessageSquare}
      title={t('no-reviews-yet')}
      description={t('this-product-doesnt-have-any-reviews-yet-be-the-first-to-share-your-thoughts')}
      actions={{
        primary: {
          label: t('write-a-review'),
          onClick: () => alert(t('review-feature-coming-soon')),
        },
      }}
    />
  )
}
