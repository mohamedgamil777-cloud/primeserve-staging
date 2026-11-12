// Homepage display order, most important for B2B buyers first.
// Anything not listed keeps its normal order after these.

// Service categories (by id)
export const SERVICE_CATEGORY_PRIORITY = [
  "f71151e1-96ee-4ac8-abb7-18f149dac4ad", // Maintenance
  "d8b872f1-f947-492e-abfa-1cac33844e2e", // HR Services
  "bc436380-d495-4078-875b-14cbea23e8f8", // Medical Insurance Services
  "5fa668fc-78b9-4ee6-ba4a-adf6cba016b0", // Facility Payment Card
  "55ecff97-1611-423d-b119-4fe35d8ba760", // Software Solutions
  "10b65c65-36b9-454c-b57a-e4cfaff18f95", // Call Center Services
  "79b12a4d-3010-496f-82fa-2e07d8a97b6c", // Health and Safety Training
  "4fed9c33-a6b8-40eb-94b3-b75e1acf7814", // Truck Delivery
  "03aa39d8-473f-456c-9b52-6a99939e1ccf", // Workforce Management
]

// Supply subcategories (by id)
export const SUPPLY_SUBCATEGORY_PRIORITY = [
  "79208799-e8ea-4dd6-8e22-52c97fe8f290", // Cleaning Essentials
  "592cfc66-3e05-4925-bda4-209a7788a9d1", // Buffet
  "9e403179-03a8-4dcc-b48f-ede2ef48ce48", // Stationery
  "845cdfcd-5009-4922-bbc6-d0f5f31b7a4a", // Health and Safety
  "09a5d356-99b1-4c06-a41e-15441b649f79", // Giveaways
]

export function sortByPriority<T extends { id: string }>(items: T[], priority: string[]): T[] {
  const rank = (id: string) => {
    const i = priority.indexOf(id)
    return i === -1 ? priority.length : i
  }
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item.id) - rank(b.item.id) || a.index - b.index)
    .map(({ item }) => item)
}
