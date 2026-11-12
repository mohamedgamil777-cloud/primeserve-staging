import { TranslatedText } from "./internationalization";

export type AnalyticsRange = "year"|"month"|"day"

export type AnalyticItem = {
  name: string;
  orders: number;
  revenue: number;
  newCustomers: number;
  returningCustomers: number;
}

export type TopProduct = {
  nameI18n: TranslatedText;
  sales: number;
  revenue: string;
  image: string;
}

export type AnalyticData = {
    current:AnalyticItem[],
    previous:AnalyticItem[],
    topProducts:TopProduct[]
}

export type CustomerAnalytics =  {
  spendingData: { month: string; amount: number }[],
  categoryData: { nameI18n: TranslatedText; value: number; color: string }[],
  orderTrendData: { month: string; orders: number }[],
  serviceTrendData: { month: string; services: number }[],
  totals: {
    current: {
      totalSpent: number
      totalOrders: number
      servicesUsed: number
      avgOrderValue: number
    }
    previous: {
      totalSpent: number
      totalOrders: number
      servicesUsed: number
      avgOrderValue: number
    }
  },
    topProducts: {
    id: string
    nameI18n: TranslatedText
    price: number
    image: string
    totalSpent: number
  }[],
  lastOrders: {
    id: string,
    code: string,
    totalAmount: number,
    status: string,
    date: Date|null,
    itemCount: number,
  }[],
  ordersByStatus: {
    status: string
    count: number
  }[],
  lastServiceRequests: {
    id: string
    category: TranslatedText
    service: TranslatedText
    status: string
    date: Date|null
  }[],
  serviceRequestsByCategory: {
    category: TranslatedText
    count: number
  }[],
}

