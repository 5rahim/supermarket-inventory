import { cn } from '@/lib/tailwind/tailwind-utils'
import { BiMinus } from '@react-icons/all-files/bi/BiMinus'
import { BiPlus } from '@react-icons/all-files/bi/BiPlus'
import { BasicField, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { inputContainerStyle, inputLeftAddon, inputLeftIcon, inputRootStyle, InputStyling, TextInputProps } from '@ui/main/forms/input/TextInput'
import * as numberInput from "@zag-js/number-input"
import { normalizeProps, useMachine } from '@zag-js/react'
import { cva } from 'class-variance-authority'
import React, { useEffect, useId } from 'react'


export interface NumberInputProps extends Omit<TextInputProps, "defaultValue" | "onChange" | "value">, InputStyling {
   defaultValue?: number
   value?: number
   onChange?: (value: number) => void
   min?: number
   max?: number
   minFractionDigits?: number
   maxFractionDigits?: number
   precision?: number
   step?: number
   allowMouseWheel?: boolean
   fullWidth?: boolean
   discrete?: boolean
}

const controlStyles = cva([
      "border border-gray-300 shadow-sm",
      "bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none disabled:pointer-events-none",
      "hover:bg-gray-100 transition",
   ],
   {
      variants: {
         size: {
            sm: "px-1",
            md: "px-3",
            lg: "px-3",
         },
      },
      defaultVariants: {
         size: "md",
      },
   },
)

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
   
   const [{
      children,
      className,
      size,
      intent,
      leftAddon,
      leftIcon,
      defaultValue = 0,
      placeholder,
      onChange,
      fullWidth,
      discrete,
      value,
      min = 0, max, minFractionDigits, maxFractionDigits = 2, precision, step, allowMouseWheel = true,
      ...rest
   }, { id, ...basicFieldProps }] = extractBasicFieldProps<NumberInputProps>(props, useId())
   
   const [state, send] = useMachine(numberInput.machine({
      id: useId(), // ISSUE: Zag.js id prop for the NumberInput Machine doesn't work
      name: basicFieldProps.name,
      disabled: basicFieldProps.isDisabled,
      readOnly: basicFieldProps.isReadOnly,
      value: value ? String(value) : undefined,
      min,
      max,
      minFractionDigits,
      maxFractionDigits,
      step,
      allowMouseWheel,
      clampValueOnBlur: true,
      onChange: (v) => {
         onChange && onChange(v.valueAsNumber)
      },
   }))
   
   useEffect(() => {
      api.setValue(defaultValue)
   }, [])
   
   // useEffect(() => {
   //    api.setValue(value)
   // }, [value])
   
   const api = numberInput.connect(state, send, normalizeProps)
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...api.rootProps}
            {...basicFieldProps}
            id={api.inputProps.id}
         >
            <div className={cn(inputContainerStyle())}>
               {!discrete && <button className={cn(controlStyles({ size }), "border-r-0 rounded-tl-md rounded-bl-md")} {...api.decrementTriggerProps}>
                   <BiMinus />
               </button>}
               {inputLeftAddon(leftAddon, leftIcon)}
               {inputLeftIcon(leftIcon)}
               <input
                  type="number"
                  name={basicFieldProps.name}
                  // value={api.value}
                  // defaultValue={defaultValue ? defaultValue : undefined}
                  className={cn(
                     "form-input",
                     inputRootStyle({ size, intent, isDisabled: basicFieldProps.isDisabled, hasError: !!basicFieldProps.error, leftIcon, leftAddon }),
                     {
                        "rounded-none border-l-0 border-r-0 text-center": !discrete,
                        "w-[3rem]": !discrete && size === "sm",
                        "w-[4rem]": !discrete && size === "md",
                        "w-[5rem]": !discrete && size === "lg",
                        "w-full": fullWidth,
                     },
                     className,
                  )}
                  disabled={basicFieldProps.isDisabled}
                  {...api.inputProps}
                  //{...rest}
                  ref={ref}
               />
               {!discrete &&
                   <button className={cn(controlStyles({ size }), "border-l-0 rounded-tr-md rounded-br-md")} {...api.incrementTriggerProps}><BiPlus />
                   </button>}
            </div>
         </BasicField>
      </>
   )
   
})
