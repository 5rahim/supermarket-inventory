import { createCalendar } from '@internationalized/date'
import { BiChevronLeft } from '@react-icons/all-files/bi/BiChevronLeft'
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight'
import { IconButton } from '@ui/main/forms/button/IconButton'
import _ from 'lodash'
import { useRef } from "react"
import { useCalendar } from "react-aria"
import { CalendarStateOptions, useCalendarState } from "react-stately"
import { CalendarGrid } from "./CalendarGrid"


export function Calendar(props: Omit<CalendarStateOptions, "createCalendar" | "locale">) {
   let countryLocale = "en-US"
   let state = useCalendarState({
      ...props,
      locale: countryLocale,
      createCalendar,
   })
   
   let ref = useRef<HTMLDivElement>(null)
   let {
      calendarProps,
      prevButtonProps: { onPress: prevButtonOnPress, ...prevButtonProps },
      nextButtonProps: { onPress: nextButtonOnPress, ...nextButtonProps },
      title,
   } = useCalendar(
      props,
      state,
   )
   
   return (
      <div {...calendarProps} ref={ref} className="inline-block text-gray-800">
         <div className="flex items-center gap-2 pb-4 w-[fit-content]">
            <IconButton
               size="sm"
               intent="primary-subtle"
               icon={<BiChevronLeft className="h-6 w-6" />} rounded {...prevButtonProps} onClick={e => {
               e.preventDefault()
               prevButtonOnPress && prevButtonOnPress(e as any)
            }}
            />
            <IconButton
               size="sm"
               intent="primary-subtle"
               icon={<BiChevronRight className="h-6 w-6" />} rounded {...nextButtonProps} onClick={e => {
               e.preventDefault()
               nextButtonOnPress && nextButtonOnPress(e as any)
            }}
            />
            <h2 className="flex-1 font-bold text-lg ml-2 w-[fit-content]">{_.capitalize(Intl.DateTimeFormat(countryLocale, {
               month: 'long', year: 'numeric',
            }).format(state.visibleRange.start.toDate(state.timeZone)))}</h2>
         </div>
         <CalendarGrid state={state} offset={{}} />
      </div>
   )
}

