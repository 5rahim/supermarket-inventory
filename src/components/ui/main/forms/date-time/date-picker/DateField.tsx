import { createCalendar } from "@internationalized/date"
import { useRef } from "react"
import { useDateField, useDateSegment } from "react-aria"
import { DateFieldState, DateFieldStateOptions, DateSegment, useDateFieldState } from "react-stately"

export function DateField(props: Omit<DateFieldStateOptions, "locale" | "createCalendar">) {
   const countryLocale = "en-US"
   
   let state = useDateFieldState({
      ...props,
      locale: countryLocale,
      createCalendar,
   })
   
   let ref = useRef<HTMLDivElement>(null)
   let { fieldProps } = useDateField(props, state, ref)
   
   return (
      <div {...fieldProps} ref={ref} className="flex">
         {state.segments.map((segment, i) => (
            <DateSegmentComponent key={i} segment={segment} state={state} />
         ))}
      </div>
   )
}

export function DateSegmentComponent({ segment, state }: { segment: DateSegment, state: DateFieldState }) {
   let ref = useRef<HTMLDivElement>(null)
   let { segmentProps } = useDateSegment(segment, state, ref)
   
   return (
      <div
         {...segmentProps}
         ref={ref}
         style={{
            ...segmentProps.style,
            // minWidth: segment.maxValue != null ? String(segment.maxValue).length + "ch" : undefined,
         }}
         className={`px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-brand-50 focus:text-brand-500 focus:font-semibold
group ${!segment.isEditable ? "text-gray-500" : "text-gray-800"}`}
      >
         {/* Always reserve space for the placeholder, to prevent layout shift when
          editing. */}
         <span
            aria-hidden="true" className="block w-full text-center italic text-gray-500 group-focus:text-brand-500
group-focus:font-semibold" style={{
            visibility: segment.isPlaceholder ? undefined : "hidden", height: segment.isPlaceholder ? undefined : 0,
            pointerEvents: "none",
         }}
         > {segment.placeholder}
         </span>
         {segment.isPlaceholder ? null : segment.text}
      </div>
   )
}
