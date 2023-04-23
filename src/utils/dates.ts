import { Nullable } from '@/types'
import addDays from 'date-fns/addDays'
import addMinutes from 'date-fns/addMinutes'
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import getWeeksInMonth from 'date-fns/getWeeksInMonth'
import isValid from 'date-fns/isValid'
import enUS from 'date-fns/locale/en-US'
import fr from 'date-fns/locale/fr'

export const getLocale = (locale: string) => locale === 'fr' ? fr : enUS

export const Dates = {
   
   getWeeksInMonth: (date: Date, lng: string) => {
      return getWeeksInMonth(date, { locale: getLocale(lng) })
   },
   
   endOfTrialDate: (date: Date) => {
      return addDays(date, 15)
   },
   
   asUTC: (date: Nullable<string>) => {
      return new Date(date as string)
   },
   shortFormat: (date: Nullable<string>, lng: string) => {
      return date ? format(new Date(date), "dd/MM/yyyy", { locale: getLocale(lng) }) : ''
   },
   longFormat: (date: Nullable<string>, lng: string) => {
      return date ? format(new Date(date), "dd/MM/yy, HH:mm", { locale: getLocale(lng) }) : ''
   },
   formatDistanceToNow: (utcDate: Nullable<Date | string>, lng: string,
      options?: { includeSeconds?: boolean | undefined, addSuffix?: boolean | undefined },
   ) => {
      if (utcDate) {
         const d = typeof utcDate === 'string' ? Dates.asUTC(utcDate) : utcDate
         if (isValid(d) && getLocale(lng)) {
            return formatDistanceToNow(d, { locale: getLocale(lng), ...options })
         }
         
      } else {
         return 'N/A'
      }
   },
   mergeDateAndTime(date: Nullable<Date>, time: Nullable<number>) {
      if (date && time) {
         return new Date(addMinutes(date, time).toUTCString())
      }
      return date
   },
   dataHasPassed(date: Nullable<Date | string>) {
      if (date && new Date(date).getTime() < new Date().getTime()) {
         return true
      } else if (!date) return true
      return false
   },
   
}
