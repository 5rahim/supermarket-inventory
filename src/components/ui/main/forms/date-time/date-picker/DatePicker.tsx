import { cn } from '@/lib/tailwind/tailwind-utils'
import { DateValue } from '@internationalized/date'
import { BiCalendar } from '@react-icons/all-files/bi/BiCalendar'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { IconButton } from '@ui/main/forms/button/IconButton'
import { inputRootStyle, InputStyling } from '@ui/main/forms/input/TextInput'
import { Modal } from '@ui/main/overlay/modal/Modal'
import React, { useEffect, useId, useRef } from "react"
import { useDatePicker } from "react-aria"
import { DatePickerStateOptions, useDatePickerState } from "react-stately"
import { Calendar } from "../calendar/Calendar"
import { DateField } from "./DateField"

export interface DatePickerProps extends Omit<DatePickerStateOptions<DateValue>, "label" | "onChange">, BasicFieldOptions, InputStyling {
   onChange?: (date: Date | undefined) => void
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
   
   const [{
      size,
      intent,
      incorrect,
      untouchable,
      leftAddon,
      leftIcon,
      onChange,
      ...datePickerProps
   }, basicFieldProps] = extractBasicFieldProps<DatePickerProps>(props, useId())
   
   let state = useDatePickerState(datePickerProps)
   let _ref = useRef<HTMLDivElement>(null)
   let {
      groupProps,
      labelProps,
      fieldProps,
      buttonProps,
      dialogProps,
      calendarProps,
   } = useDatePicker(datePickerProps, state, _ref)
   
   const { onPress, ...restButtonProps } = buttonProps
   
   useEffect(() => {
      try {
         const _date = state.dateValue.toDate('Etc/UTC')
         onChange && onChange(_date)
      }
      catch (e) {
         onChange && onChange(undefined)
      }
   }, [state.dateValue])
   
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
                     "form-input relative flex flex-wrap items-center gap-2 cursor-text",
                     inputRootStyle({
                        size, intent, isDisabled: basicFieldProps.isDisabled, leftIcon, leftAddon, hasError: !!basicFieldProps.error,
                     }), "group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500", "justify-between")}
               >
                  <div
                     className="flex"
                  ><DateField {...fieldProps} /> {/*{state.validationState === "invalid" && (*/} {/*   <BsExclamation className="w-6 h-6
                   text-red-500 absolute right-8" />*/} {/*)}*/} </div>
                  <IconButton
                     intent="gray-basic" size="xs" {...restButtonProps} icon={<BiCalendar
                     className="w-5 h-5 group-focus-within:text-brand-700"
                  />} onClick={e => onPress && onPress(e as any)}
                  /></div>
            </div>
            <Modal
               size="sm"
               isOpen={state.isOpen} onClose={state.close} actions={[{ action: 'close' }]}
            >
               <div className="flex justify-center"><Calendar
                  {...calendarProps} /></div>
            </Modal></div>
      </BasicField>)
})
