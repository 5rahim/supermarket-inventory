import { useDateFormatter } from "@react-aria/i18n"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { BiChevronLeft } from '@react-icons/all-files/bi/BiChevronLeft'
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight'
import { IconButton } from '@ui/main/forms/button/IconButton'
import _ from 'lodash'
import React from 'react'
import { AriaButtonProps } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'

interface CalendarHeaderProps {
   state: CalendarState | RangeCalendarState
   calendarProps: any
   prevButtonProps: AriaButtonProps
   nextButtonProps: AriaButtonProps
}

export function CalendarHeader({
   state,
   calendarProps,
   prevButtonProps,
   nextButtonProps,
}: CalendarHeaderProps) {
   const countryLocale = "en-US"
   let monthDateFormatter = useDateFormatter({
      month: "long",
      year: "numeric",
      timeZone: state.timeZone,
   })
   
   const { onPress: prevButtonOnPress, ...prevButtonRest } = prevButtonProps
   const { onPress: nextButtonOnPress, ...nextButtonRest } = nextButtonProps
   
   return (
      <div className="flex items-center py-4 text-center">
         {/* Add a screen reader only description of the entire visible range rather than
          * a separate heading above each month grid. This is placed first in the DOM order
          * so that it is the first thing a touch screen reader user encounters.
          * In addition, VoiceOver on iOS does not announce the aria-label of the grid
          * elements, so the aria-label of the Calendar is included here as well. */}
         <VisuallyHidden>
            <h2>{calendarProps["aria-label"]}</h2>
         </VisuallyHidden>
         <IconButton
            size="sm"
            intent="primary-subtle"
            icon={<BiChevronLeft className="h-6 w-6" />} rounded {...prevButtonRest} onClick={e => {
            e.preventDefault()
            prevButtonOnPress && prevButtonOnPress(e as any)
         }}
         />
         <h2
            // We have a visually hidden heading describing the entire visible range,
            // and the calendar itself describes the individual month
            // so we don't need to repeat that here for screen reader users.
            aria-hidden
            className="flex-1 align-center font-bold text-md text-center"
         >
            {/*{monthDateFormatter.format(*/}
            {/*   state.visibleRange.start.toDate(state.timeZone),*/}
            {/*)}*/}
            {_.capitalize(Intl.DateTimeFormat(countryLocale, {
               month: 'long', year: 'numeric',
            }).format(state.visibleRange.start.toDate(state.timeZone)))}
         </h2>
         <h2
            aria-hidden
            className="flex-1 align-center font-bold text-md text-center"
         >
            {/*{monthDateFormatter.format(*/}
            {/*   state.visibleRange.start.add({ months: 1 }).toDate(state.timeZone),*/}
            {/*)}*/}
            {_.capitalize(Intl.DateTimeFormat(countryLocale, {
               month: 'long', year: 'numeric',
            }).format(state.visibleRange.start.add({ months: 1 }).toDate(state.timeZone)))}
         </h2>
         <IconButton
            size="sm"
            intent="primary-subtle"
            icon={<BiChevronRight className="h-6 w-6" />} rounded {...nextButtonRest} onClick={e => {
            e.preventDefault()
            nextButtonOnPress && nextButtonOnPress(e as any)
         }}
         />
      </div>
   )
}
