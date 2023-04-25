import { cn } from '@/lib/tailwind/tailwind-utils'
import { DateValue, Time } from '@internationalized/date'
import { useTimeField } from "@react-aria/datepicker"
import { BiTime } from '@react-icons/all-files/bi/BiTime'
import { useTimeFieldState } from "@react-stately/datepicker"
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { DateSegmentComponent } from '@ui/main/forms/date-time/date-picker/DateField'
import { inputLeftIcon, inputRootStyle, InputStyling } from '@ui/main/forms/input/TextInput'
import React, { useEffect, useId, useRef } from "react"
import { TimeFieldStateOptions } from 'react-stately'

export type TimeObject = { hour: number, minute: number }

export const dateValueToTimeObject = (value: DateValue): TimeObject => {
   return { hour: (value as any).hour, minute: (value as any).minute }
}

export interface TimeInputProps extends Omit<TimeFieldStateOptions, "locale" | "onChange" | "defaultValue">, BasicFieldOptions, InputStyling {
   onChange?: (value: TimeObject | undefined) => void
   defaultValue?: TimeObject
}

export const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>((props, ref) => {
   
   const [{
      size,
      intent,
      incorrect,
      untouchable,
      leftAddon,
      leftIcon = <BiTime />,
      onChange,
      defaultValue,
      ...datePickerProps
   }, basicFieldProps] = extractBasicFieldProps<TimeInputProps>(props, useId())
   
   const countryLocale = "en-US"
   let state = useTimeFieldState({
      ...datePickerProps,
      defaultValue: defaultValue ? new Time(defaultValue.hour, defaultValue.minute) : undefined,
      locale: countryLocale,
   })
   
   let _ref = useRef<HTMLDivElement>(null)
   let { labelProps, fieldProps } = useTimeField(datePickerProps, state, _ref)
   
   useEffect(() => {
      try {
         onChange && onChange(dateValueToTimeObject(state.value))
      }
      catch (e) {
         onChange && onChange(undefined)
      }
   }, [state.value])
   
   return (
      <BasicField
         {...basicFieldProps}
      >
         <div className="flex flex-col items-start relative">
            {inputLeftIcon(leftIcon)}
            <div
               {...fieldProps}
               ref={_ref}
               className={cn(
                  "form-input relative flex flex-wrap items-center gap-1 cursor-text",
                  // "flex bg-white border border-gray-300 hover:border-gray-400 transition-colors rounded-md pr-8 focus-within:border-violet-600
                  // focus-within:hover:border-violet-600 p-1"
                  inputRootStyle({ size, intent, isDisabled: basicFieldProps.isDisabled, leftIcon, leftAddon, hasError: !!basicFieldProps.error }),
                  "group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500",
                  "!w-[fit-content]",
               )}
            >
               {state.segments.map((segment, i) => (
                  <DateSegmentComponent key={i} segment={segment} state={state} />
               ))}
            </div>
         </div>
      </BasicField>
   )
   
})
