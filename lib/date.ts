import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns'

const now = new Date()

export function getBounds(period: "weekly" | "monthly" | "quarterly" | "yearly") {
  switch (period) {
    case "weekly":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case "monthly":
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case "quarterly":
      return { start: startOfQuarter(now), end: endOfQuarter(now) }
    case "yearly":
      return { start: startOfYear(now), end: endOfYear(now) }
  }
}

export function formatDate(date:string|number|Date) {
	const d = date instanceof Date ? date : new Date(date),
		year = d.getFullYear()
	let	month = '' + (d.getMonth() + 1),
		day = '' + d.getDate()

	if (month.length < 2) 
		month = '0' + month;
	if (day.length < 2) 
		day = '0' + day;

	return [year, month, day].join('-');
}

/**
 * returns the given date when the current date was just begining
 */
export function getDayStart(date:Date){
	const editedDate = new Date(date.getTime())
	editedDate.setHours(0)
	editedDate.setMinutes(0)
	editedDate.setSeconds(1)
	return editedDate
}
/**
 * returns the given date when the current date was just begining
 */
export function getDayEnd(date:Date){
	const editedDate = new Date(date.getTime())
	editedDate.setHours(23)
	editedDate.setMinutes(59)
	editedDate.setSeconds(59)
	return editedDate
}

export type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

const weekdays: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const weekdayToIndex = (day: DayOfWeek): number => weekdays.indexOf(day);

export const indexToWeekday = (index: number): DayOfWeek => weekdays[index];


export const to24HourTime = (time12: string): string => {
  const [time, modifier] = time12.split(" ")
  let [hours, minutes] = time.split(":").map(Number)

  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

export const to12HourFormat = (time24: string): string => {
  const [hourStr, minuteStr] = time24.split(":")
  let hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  hour = hour % 12 || 12
  return `${hour}:${minuteStr} ${ampm}`
}

// "00:15:00" => 15
export const intervalToMinutes = (intervalStr: string): number => {
  const [hours, minutes, seconds] = intervalStr.split(":").map(Number)
  return hours * 60 + minutes + Math.round(seconds / 60)
}


export function getMonthAndDay(date: Date): string[] {
	return format(date,"MMM do").split(",").at(0)!.split(" ")
}


export function getDateNDaysFrom(date: Date, n: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + n)
  return result
}