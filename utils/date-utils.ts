import { format, formatDistanceToNow } from "date-fns"
import { el } from "date-fns/locale"

export const formatDate = (date: string | Date) => {
  return format(new Date(date), "d MMMM yyyy", { locale: el })
}

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: el })
}
