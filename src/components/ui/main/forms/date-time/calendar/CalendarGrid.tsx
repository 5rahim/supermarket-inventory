import { Dates } from '@/utils/dates'
import { DateDuration, endOfMonth } from "@internationalized/date"
import { useCalendarGrid } from "@react-aria/calendar"
import { useMemo } from 'react'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarCell } from "./CalendarCell"

interface CalendarGridProps {
   state: CalendarState | RangeCalendarState
   offset: DateDuration
}

export function CalendarGrid({ state, offset = {} }: CalendarGridProps) {
   const countryLocale = "en-US"
   let startDate = state.visibleRange.start.add(offset)
   let endDate = endOfMonth(startDate)
   let { gridProps, headerProps, weekDays } = useCalendarGrid(
      {
         startDate,
         endDate,
      },
      state,
   )
   
   // Get the number of weeks in the month so we can render the proper number of rows.
   let weeksInMonth = useMemo(() => Dates.getWeeksInMonth(startDate.toDate(state.timeZone), countryLocale), [countryLocale])
   
   const frWeekdays = useMemo(() => ['L', 'M', 'M', 'J', 'V', 'S', 'D'], [])
   
   weekDays = useMemo(() => {
      const [first, ...r] = weekDays
      const arr = [...r!, first!]
      if (countryLocale.includes('fr')) {
         return frWeekdays
      }
      return arr
   }, [countryLocale])
   
   return (
      <table {...gridProps} cellPadding="0" className="flex-1">
         <thead {...headerProps} className="text-gray-600 text-center">
         <tr>
            {weekDays.map((day, index) => (
               <th key={index}>{day}</th>
            ))}
         </tr>
         </thead>
         <tbody>
         {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
            <tr key={weekIndex}>
               {state
                  .getDatesInWeek(weekIndex, startDate)
                  .map((date, i) =>
                     date ? (
                        <CalendarCell
                           key={i}
                           state={state}
                           date={date}
                           currentMonth={startDate}
                        />
                     ) : (
                        <td key={i} />
                     ),
                  )}
            </tr>
         ))}
         </tbody>
      </table>
   )
}

