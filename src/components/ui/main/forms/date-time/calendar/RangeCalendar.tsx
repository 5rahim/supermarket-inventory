import { createCalendar } from '@internationalized/date'
import { useRef } from "react"
import { useRangeCalendar } from "react-aria"
import { RangeCalendarStateOptions, useRangeCalendarState } from "react-stately"
import { CalendarGrid } from "./CalendarGrid"
import { CalendarHeader } from './CalendarHeader'


export function RangeCalendar(props: Omit<RangeCalendarStateOptions, "createCalendar" | "locale">) {
   const countryLocale = "en-US"
   let state = useRangeCalendarState({
      ...props,
      visibleDuration: { months: 2 },
      locale: countryLocale,
      createCalendar,
   })
   
   let ref = useRef<HTMLDivElement>(null)
   let {
      calendarProps,
      prevButtonProps,
      nextButtonProps,
   } = useRangeCalendar(
      props,
      state,
      ref,
   )
   
   return (
      <div {...calendarProps} ref={ref} className="inline-block text-gray-800">
         <CalendarHeader
            state={state}
            calendarProps={calendarProps}
            prevButtonProps={prevButtonProps}
            nextButtonProps={nextButtonProps}
         />
         <div className="flex items-center gap-2 pb-4 w-[fit-content]">
            <div className="flex flex-col md:flex-row gap-8">
               <CalendarGrid state={state} offset={{}} />
               <CalendarGrid state={state} offset={{ months: 1 }} />
            </div>
         </div>
      </div>
   )
}

