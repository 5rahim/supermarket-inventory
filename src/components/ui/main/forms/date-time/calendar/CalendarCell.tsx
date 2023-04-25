import { cn } from '@/lib/tailwind/tailwind-utils'
import { CalendarDate, DateValue, getDayOfWeek, isSameDay, isSameMonth } from "@internationalized/date"
import { useCalendarCell } from "@react-aria/calendar"
import { useFocusRing } from "@react-aria/focus"
import { useLocale } from "@react-aria/i18n"
import { mergeProps } from "@react-aria/utils"
import { useRef } from "react"
import { CalendarState, RangeCalendarState } from 'react-stately'

interface CalendarCellProps {
   state: CalendarState | RangeCalendarState
   date: CalendarDate
   currentMonth: DateValue
}

export function CalendarCell({ state, date, currentMonth }: CalendarCellProps) {
   let ref = useRef<HTMLDivElement>(null)
   let {
      cellProps,
      buttonProps,
      isSelected,
      isDisabled,
      isUnavailable,
      formattedDate,
   } = useCalendarCell({ date }, state, ref)
   
   let isOutsideMonth = !isSameMonth(currentMonth, date)
   
   // The start and end date of the selected range will have
   // an emphasized appearance.
   let isSelectionStart = (state as RangeCalendarState).highlightedRange
      ? isSameDay(date, (state as RangeCalendarState).highlightedRange.start)
      : isSelected
   let isSelectionEnd = (state as RangeCalendarState).highlightedRange
      ? isSameDay(date, (state as RangeCalendarState).highlightedRange.end)
      : isSelected
   
   // We add rounded corners on the left for the first day of the month,
   // the first day of each week, and the start date of the selection.
   // We add rounded corners on the right for the last day of the month,
   // the last day of each week, and the end date of the selection.
   let { locale } = useLocale()
   let dayOfWeek = getDayOfWeek(date, locale)
   let isRoundedLeft =
      isSelected && (isSelectionStart)
   let isRoundedRight =
      isSelected &&
      (isSelectionEnd)
   
   let { focusProps, isFocusVisible } = useFocusRing()
   
   return (
      <td
         {...cellProps}
         className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
      >
         <div
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            hidden={isOutsideMonth}
            className={cn(
               "w-10 h-10 outline-none group",
               {
                  "rounded-l-full": isRoundedLeft,
                  "rounded-r-full": isRoundedRight,
                  "bg-brand-100": isSelected,
                  "disabled": isDisabled || isUnavailable,
                  
               },
            )}
         >
            <div
               className={cn(
                  "w-full h-full rounded-full flex items-center justify-center",
                  {
                     "cursor-pointer": !isDisabled && !isUnavailable,
                     "text-gray-400 cursor-default": isDisabled,
                     "text-red-300 cursor-default": isUnavailable,
                     "ring-2 group-focus:z-2 ring-brand-600 ring-offset-2": isFocusVisible,
                     "bg-brand-600 text-white hover:bg-brand-700": isSelectionStart || isSelectionEnd,
                     "hover:bg-brand-400": isSelected && !(isSelectionStart || isSelectionEnd),
                     "hover:bg-brand-100": !isSelected && !isDisabled && !isUnavailable,
                  },
               )}
            >
               {formattedDate}
            </div>
         </div>
      </td>
   )
}

