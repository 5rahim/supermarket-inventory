import { cn } from '@/lib/tailwind/tailwind-utils'
import { BiCalendar } from '@react-icons/all-files/bi/BiCalendar'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { IconButton } from '@ui/main/forms/button/IconButton'
import { RangeCalendar } from '@ui/main/forms/date-time/calendar/RangeCalendar'
import { inputRootStyle, InputStyling } from '@ui/main/forms/input/TextInput'
import { Modal } from '@ui/main/overlay/modal/Modal'
import React, { useEffect, useId, useRef } from "react"
import { useDateRangePicker } from "react-aria"
import { DateRangePickerStateOptions, useDateRangePickerState } from "react-stately"
import { DateField } from "./DateField"

export interface DateRangePickerProps extends Omit<DateRangePickerStateOptions, "label" | "onChange">, BasicFieldOptions, InputStyling {
   onChange?: (value: { start: Date | undefined, end: Date | undefined } | undefined) => void
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>((props, ref) => {
   
   const [{
      size,
      intent,
      incorrect,
      untouchable,
      leftAddon,
      leftIcon,
      onChange,
      ...datePickerProps
   }, basicFieldProps] = extractBasicFieldProps<DateRangePickerProps>(props, useId())
   
   let state = useDateRangePickerState(datePickerProps)
   let _ref = useRef<HTMLDivElement>(null)
   let {
      groupProps,
      labelProps,
      startFieldProps,
      endFieldProps,
      buttonProps,
      dialogProps,
      calendarProps,
   } = useDateRangePicker(datePickerProps, state, _ref)
   
   let { onPress, ...restButtonProps } = buttonProps
   
   useEffect(() => {
      try {
         const _start = state.value.start.toDate('Etc/UTC')
         const _end = state.value.end.toDate('Etc/UTC')
         onChange && onChange({ start: _start, end: _end })
      }
      catch (e) {
         onChange && onChange(undefined)
      }
   }, [state.value])
   
   return (
      <BasicField
         {...basicFieldProps}
         labelProps={labelProps}
      >
         <div
            className="relative inline-flex flex-col text-left"
         >
            <div {...groupProps} ref={_ref} className="flex group">
               <div
                  className={cn(
                     "form-input relative flex flex-wrap items-center gap-1 cursor-text",
                     inputRootStyle({
                        size, intent, isDisabled: basicFieldProps.isDisabled, leftIcon, leftAddon, hasError: !!basicFieldProps.error,
                     }), "group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500", "justify-between text-sm")}
               >
                  <div
                     className="flex"
                  ><DateField {...startFieldProps} /> <span aria-hidden="true" className="px-1"> – </span> <DateField {...endFieldProps} />
                     {/*{state.validationState === "invalid" && (*/} {/*   <BsExclamation className="w-6 h-6 text-red-500 absolute right-8" />*/} {/*)}*/}
                  </div>
                  <IconButton
                     intent="gray-basic" size="xs" {...restButtonProps} icon={<BiCalendar className="w-5 h-5 group-focus-within:text-brand-700" />}
                     onClick={e => onPress && onPress(e as any)}
                  /></div>
            </div>
            <Modal
               size="xl" isOpen={state.isOpen} onClose={state.close} actions={[{
               action:
                  'close',
            }]}
            >
               <div className="flex justify-center"><RangeCalendar {...calendarProps} /></div>
            </Modal></div>
      </BasicField>)
})
