import { and, avg, between, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm"
import { 
  startOfYear, endOfYear, startOfMonth, endOfMonth, startOfDay, endOfDay,
  subYears, subMonths, subDays, 
  format,
  eachMonthOfInterval
} from "date-fns"
import { db } from ".."
import { categories, orderItems, orders, products, serviceCategories, serviceRequests, services, users } from "../schema"
import { CustomerAnalytics } from "@/types/analytics"

export type AnalyticsRange = "year" | "month" | "day"
export type AnalyticsPeriod = "current" | "previous"

export const getAnalytics = async (
  storeId: string, 
  range: AnalyticsRange,
  period: AnalyticsPeriod = "current"
) => {
  const now = new Date()

  let from: Date
  let to: Date
  let pgFormat: string
  let labelCount: number
  let labelFn: (i: number) => string
  let keyToLabelMap: Record<string, string> = {}

  // Adjust date range based on period
  const getDateRange = () => {
    if (range === "year") {
      if (period === "previous") {
        return {
          from: startOfYear(subYears(now, 1)),
          to: endOfYear(subYears(now, 1))
        }
      }
      return {
        from: startOfYear(now),
        to: endOfYear(now)
      }
    } else if (range === "month") {
      if (period === "previous") {
        return {
          from: startOfMonth(subMonths(now, 1)),
          to: endOfMonth(subMonths(now, 1))
        }
      }
      return {
        from: startOfMonth(now),
        to: endOfMonth(now)
      }
    } else {
      if (period === "previous") {
        return {
          from: startOfDay(subDays(now, 1)),
          to: endOfDay(subDays(now, 1))
        }
      }
      return {
        from: startOfDay(now),
        to: endOfDay(now)
      }
    }
  }

  const { from: rangeFrom, to: rangeTo } = getDateRange()
  from = rangeFrom
  to = rangeTo

  if (range === "year") {
    pgFormat = 'MM'
    labelCount = 12
    // Create mapping between numeric keys (01-12) and month names
    Array.from({ length: 12 }).forEach((_, i) => {
      const monthNum = (i + 1).toString().padStart(2, '0')
      const monthName = new Date(0, i).toLocaleString("default", { month: "short" })
      keyToLabelMap[monthNum] = monthName
    })
    labelFn = (i) => keyToLabelMap[(i + 1).toString().padStart(2, '0')] || ''
  } else if (range === "month") {
    pgFormat = 'DD'
    // Get actual days in the selected month (works for previous month too)
    labelCount = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate()
    labelFn = (i) => `${i + 1}`
  } else {
    pgFormat = 'HH24'
    labelCount = 24
    labelFn = (i) => `${i}`
  }

  // Get order data using Drizzle's query builder
  const orderData = await db
    .select({
      key: sql<string>`to_char(${orders.createdAt}, ${pgFormat})`.as("key"),
      orders: count(),
      revenue: sum(orders.totalAmount)
    })
    .from(orders)
    .where(
      and(
        eq(orders.storeId, storeId),
        between(orders.createdAt, from, to)
      )
    )
    .groupBy(sql`key`)

  // Get new customer data
  const customerData = await db
    .select({
      key: sql<string>`to_char(${users.createdAt}, ${pgFormat})`.as("key"),
      newCustomers: count()
    })
    .from(users)
    .where(
      and(
        eq(users.storeId, storeId),
        between(users.createdAt, from, to)
      )
    )
    .groupBy(sql`key`)

  // Get returning customer data
  const returningCustomerData = await db
    .select({
      key: sql<string>`to_char(${orders.createdAt}, ${pgFormat})`.as("key"),
      returningCustomers: sql<number>`COUNT(DISTINCT ${orders.userId})`
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(
      and(
        eq(orders.storeId, storeId),
        between(orders.createdAt, from, to),
        lte(users.createdAt, from)
      )
    )
    .groupBy(sql`key`)

  // For year range, we need to match numeric keys (01-12) with month names
  const normalizeKey = (key: string, isLabel = false) => {
    if (range === "year") {
      return isLabel ? keyToLabelMap[key.padStart(2, '0')] : key.padStart(2, '0')
    }
    return key.padStart(2, "0")
  }

  const orderMap = new Map(orderData.map(item => [normalizeKey(item.key), item]))
  const customerMap = new Map(customerData.map(item => [normalizeKey(item.key), item]))
  const returningMap = new Map(returningCustomerData.map(item => [normalizeKey(item.key), item]))

  const merged = Array.from({ length: labelCount }, (_, i) => {
    // For year range, keys are 01-12, for others they're index-based
    const key = range === "year" 
      ? (i + 1).toString().padStart(2, '0')
      : i.toString().padStart(2, '0')

    const ordersEntry = orderMap.get(key)
    const customersEntry = customerMap.get(key)
    const returningEntry = returningMap.get(key)

    return {
      name: labelFn(i),
      orders: ordersEntry?.orders ?? 0,
      revenue: Number(ordersEntry?.revenue ?? 0),
      newCustomers: customersEntry?.newCustomers ?? 0,
      returningCustomers: returningEntry?.returningCustomers ?? 0,
      period, // Include which period this data represents
    }
  })

  return merged
}

export const getTopProducts = async (storeId: string, range: AnalyticsRange) => {
  const now = new Date()

  let from: Date
  let to: Date

  // Set date range based on period
  if (range === "year") {
    from = startOfYear(now)
    to = endOfYear(now)
  } else if (range === "month") {
    from = startOfMonth(now)
    to = endOfMonth(now)
  } else {
    from = startOfDay(now)
    to = endOfDay(now)
  }

  // Query to get top products by revenue and sales count
  const topProducts = await db
    .select({
      id: products.id,
      nameI18n: products.nameI18n,
      mainImage: products.mainImage,
      sales: count(orderItems.id),
      revenue: sum(orderItems.price)
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(orders.storeId, storeId),
        between(orders.createdAt, from, to)
      )
    )
    .groupBy(products.id)
    .orderBy(desc(sum(orderItems.price))) // Order by revenue descending
    .limit(5)

  // Format the results
  return topProducts.map(product => ({
    nameI18n: product.nameI18n,
    sales: product.sales,
    revenue: `$${Number(product.revenue ?? 0).toFixed(2)}`, // Format as currency
    image: product.mainImage,
  }))
}

export const getCustomerAnalytics = async (
  userId: string,
  storeId: string,
  range: AnalyticsRange = "year"
): Promise<CustomerAnalytics> => {
  const now = new Date()
  const extendedColorPalette = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c", "#d0ed57",
    "#83a6ed", "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc658", "#ff8042",
    "#ffbb28", "#ff8042", "#00c49f", "#0088fe", "#ff6b6b", "#4ecdc4"
  ]

  // Current period date range
  let currentFrom: Date, currentTo: Date
  let previousFrom: Date, previousTo: Date

  if (range === "year") {
    currentFrom = startOfYear(now)
    currentTo = endOfYear(now)
    previousFrom = startOfYear(subYears(now, 1))
    previousTo = endOfYear(subYears(now, 1))
  } else if (range === "month") {
    currentFrom = startOfMonth(now)
    currentTo = endOfMonth(now)
    previousFrom = startOfMonth(subMonths(now, 1))
    previousTo = endOfMonth(subMonths(now, 1))
  } else {
    currentFrom = startOfDay(now)
    currentTo = endOfDay(now)
    previousFrom = startOfDay(subDays(now, 1))
    previousTo = endOfDay(subDays(now, 1))
  }

  // Generate trend data points based on selected range
  let trendPoints: { month: string; start: Date; end: Date }[] = []

  if (range === "year") {
    const months = eachMonthOfInterval({ start: currentFrom, end: currentTo })
    trendPoints = months.map(month => ({
      month: format(month, 'MMM'),
      start: startOfMonth(month),
      end: endOfMonth(month)
    }))
  } else if (range === "month") {
    const daysInMonth = new Date(currentFrom.getFullYear(), currentFrom.getMonth() + 1, 0).getDate()
    trendPoints = Array.from({ length: daysInMonth }).map((_, i) => {
      const day = new Date(currentFrom.getFullYear(), currentFrom.getMonth(), i + 1)
      return {
        month: format(day, 'd'),
        start: startOfDay(day),
        end: endOfDay(day)
      }
    })
  } else {
    trendPoints = Array.from({ length: 24 }).map((_, i) => {
      const hour = new Date(currentFrom)
      hour.setHours(i, 0, 0, 0)
      return {
        month: format(hour, 'HH:mm'),
        start: new Date(hour),
        end: new Date(hour.setHours(hour.getHours() + 1))
      }
    })
  }

  // 1. Get spending data for current period (fixed GROUP BY clause)
  const spendingResults = await db
    .select({
      month: sql<string>`to_char(${orders.createdAt}, 'Mon')`.as("month"),
      amount: sum(orders.totalAmount).as("amount")
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(sql`to_char(${orders.createdAt}, 'Mon')`, sql`to_char(${orders.createdAt}, 'MM')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'MM')`)

  // 2. Get category distribution with names (fixed to join with categories table)
  const categoryResults = await db
    .select({
      nameI18n: categories.nameI18n,
      value: sql<number>`COUNT(${orderItems.id})`.as("value")
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(categories.nameI18n, categories.id) // Added categories.id to GROUP BY
    .orderBy(sql`value DESC`)
    .limit(6)

  // 3. Get accurate order trend data
  const orderTrendResults = await db
    .select({
      month: sql<string>`to_char(${orders.createdAt}, 'Mon')`.as("month"),
      monthNum: sql<number>`to_char(${orders.createdAt}, 'MM')::int`.as("monthnum"),
      orders: count(orders.id).as("orders")
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(sql`month`, sql`monthnum`)
    .orderBy(sql`monthnum`)

  // Create a complete trend data set with all months, filling in zeros where needed
  const completeOrderTrendData = trendPoints.map(({ month }) => {
    const foundMonth = orderTrendResults.find(r => r.month.replace(/'/g, '') === month)
    return {
      month,
      orders: foundMonth ? Number(foundMonth.orders) : 0
    }
  })

  // 4. Get service trend data
  const serviceTrendResults = await Promise.all(
    trendPoints.map(async ({ month, start, end }) => {
      const result = await db
        .select({
          count: count(serviceRequests.id).as("count")
        })
        .from(serviceRequests)
        .where(
          and(
            eq(serviceRequests.userId, userId),
            eq(serviceRequests.storeId, storeId),
            between(serviceRequests.createdAt, start, end)
          )
        )
      return { month, services: result[0]?.count || 0 }
    })
  )

  // 5. Get accurate totals for both current and previous periods
  const [currentTotals, previousTotals] = await Promise.all([
    // Current period totals
    db.transaction(async (tx) => {
      // Get order totals separately
      const orderTotals = await tx
        .select({
          totalSpent: sum(orders.totalAmount).as("totalSpent"),
          totalOrders: count(orders.id).as("totalOrders"),
          avgOrderValue: avg(orders.totalAmount).as("avgOrderValue")
        })
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            eq(orders.storeId, storeId),
            between(orders.createdAt, currentFrom, currentTo)
          )
        )

      // Get service totals separately
      const serviceTotals = await tx
        .select({
          servicesUsed: count(serviceRequests.id).as("servicesUsed")
        })
        .from(serviceRequests)
        .where(
          and(
            eq(serviceRequests.userId, userId),
            eq(serviceRequests.storeId, storeId),
            between(serviceRequests.createdAt, currentFrom, currentTo)
          )
        )

      return {
        totalSpent: orderTotals[0]?.totalSpent || 0,
        totalOrders: orderTotals[0]?.totalOrders || 0,
        servicesUsed: serviceTotals[0]?.servicesUsed || 0,
        avgOrderValue: orderTotals[0]?.avgOrderValue || 0
      }
    }),
    
    // Previous period totals
    db.transaction(async (tx) => {
      // Get order totals separately
      const orderTotals = await tx
        .select({
          totalSpent: sum(orders.totalAmount).as("totalSpent"),
          totalOrders: count(orders.id).as("totalOrders"),
          avgOrderValue: avg(orders.totalAmount).as("avgOrderValue")
        })
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            eq(orders.storeId, storeId),
            between(orders.createdAt, previousFrom, previousTo)
          )
        )

      // Get service totals separately
      const serviceTotals = await tx
        .select({
          servicesUsed: count(serviceRequests.id).as("servicesUsed")
        })
        .from(serviceRequests)
        .where(
          and(
            eq(serviceRequests.userId, userId),
            eq(serviceRequests.storeId, storeId),
            between(serviceRequests.createdAt, previousFrom, previousTo)
          )
        )

      return {
        totalSpent: orderTotals[0]?.totalSpent || 0,
        totalOrders: orderTotals[0]?.totalOrders || 0,
        servicesUsed: serviceTotals[0]?.servicesUsed || 0,
        avgOrderValue: orderTotals[0]?.avgOrderValue || 0
      }
    })
  ])


    // 6. Get top 5 most expensive unique products bought in current period
  const topProducts = await db
    .select({
      productId: products.id,
      nameI18n: products.nameI18n,
      price: products.price,
      mainImage: products.mainImage,
      totalSpent: sum(orders.totalAmount).as("totalSpent")
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(products.id, products.nameI18n, products.price, products.mainImage)
    .orderBy(desc(sum(orders.totalAmount)))
    .limit(5)

  // 7. Get last 5 orders in current period
  const lastOrders = await db
    .select({
      id: orders.id,
      code: orders.code,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      items: orders.productsCount
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt))
    .limit(5)

  // 8. Get count of orders by status in current period
  const ordersByStatus = await db
    .select({
      status: orders.status,
      count: count(orders.id).as("count")
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.storeId, storeId),
        between(orders.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(orders.status)

  // 9. Get last 5 service requests in current period (fixed join)
  const lastServiceRequests = await db
    .select({
      id: serviceRequests.id,
      serviceId: serviceRequests.serviceId,
      serviceName: services.nameI18n,
      categoryId: services.categoryId,
      categoryName: serviceCategories.nameI18n,
      status: serviceRequests.status,
      createdAt: serviceRequests.createdAt
    })
    .from(serviceRequests)
    .innerJoin(services, eq(serviceRequests.serviceId, services.id))
    .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
    .where(
      and(
        eq(serviceRequests.userId, userId),
        eq(serviceRequests.storeId, storeId),
        between(serviceRequests.createdAt, currentFrom, currentTo)
      )
    )
    .orderBy(desc(serviceRequests.createdAt))
    .limit(5)

  // 10. Get count of service requests by category in current period (fixed join)
  const serviceRequestsByCategory = await db
    .select({
      categoryId: services.categoryId,
      categoryName: serviceCategories.nameI18n,
      count: count(serviceRequests.id).as("count")
    })
    .from(serviceRequests)
    .innerJoin(services, eq(serviceRequests.serviceId, services.id))
    .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
    .where(
      and(
        eq(serviceRequests.userId, userId),
        eq(serviceRequests.storeId, storeId),
        between(serviceRequests.createdAt, currentFrom, currentTo)
      )
    )
    .groupBy(services.categoryId, serviceCategories.nameI18n) 

  // Format the results
  return {
    spendingData: spendingResults.map(r => ({
      month: r.month.replace(/'/g, ''), // Remove single quotes from month names
      amount: Number(r.amount) || 0
    })),
    categoryData: categoryResults.map((r, i) => ({
      nameI18n: r.nameI18n || {"en":'Uncategorized'},
      value: Number(r.value),
      color: extendedColorPalette[i % extendedColorPalette.length]
    })),
    orderTrendData: completeOrderTrendData,
    serviceTrendData: serviceTrendResults,
    totals: {
      current: {
        totalSpent: Number(currentTotals?.totalSpent) || 0,
        totalOrders: Number(currentTotals?.totalOrders) || 0,
        servicesUsed: Number(currentTotals?.servicesUsed) || 0,
        avgOrderValue: Number(currentTotals?.avgOrderValue) || 0
      },
      previous: {
        totalSpent: Number(previousTotals?.totalSpent) || 0,
        totalOrders: Number(previousTotals?.totalOrders) || 0,
        servicesUsed: Number(previousTotals?.servicesUsed) || 0,
        avgOrderValue: Number(previousTotals?.avgOrderValue) || 0
      }
    },
    topProducts: topProducts.map(p => ({
      id: p.productId,
      nameI18n: p.nameI18n,
      price: Number(p.price),
      image: p.mainImage || "/placeholder.png",
      totalSpent: Number(p.totalSpent) || 0
    })),
    lastOrders: lastOrders.map(o => ({
      id: o.id,
      code: o.code,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      date: o.createdAt,
      itemCount: Number(o.items)
    })),
    ordersByStatus: ordersByStatus.map(os => ({
      status: os.status || 'unknown',
      count: Number(os.count)
    })),
    lastServiceRequests: lastServiceRequests.map(sr => ({
      id: sr.id,
      service: sr.serviceName || 'Unknown Service',
      category: sr.categoryName || {"en":'Uncategorized'},
      status: sr.status,
      date: sr.createdAt ?? new Date()
    })),
    serviceRequestsByCategory: serviceRequestsByCategory.map(src => ({
      category: src.categoryName || {"en":'Uncategorized'},
      count: Number(src.count)
    }))    
  }
}