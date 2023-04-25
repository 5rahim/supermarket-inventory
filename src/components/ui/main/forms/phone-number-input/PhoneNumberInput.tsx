import { cn } from '@/lib/tailwind/tailwind-utils'
import { Nullish } from '@/types'
import { BasicField, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { inputStyles, TextInputProps } from '@ui/main/forms/input/TextInput'
import { CountryCode, E164Number } from 'libphonenumber-js'
import React, { useId } from 'react'
import PhoneInput from 'react-phone-number-input'


export interface PhoneNumberInputProps extends Omit<TextInputProps, "value" | "onChange"> {
   value: Nullish<string>
   onChange: (value: E164Number | undefined) => void
   defaultCountry?: string
}

export const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>((props, ref) => {
   
   const [{
      children,
      className,
      size = "md",
      intent = "basic",
      value,
      onChange,
      placeholder,
      defaultCountry,
   }, basicFieldProps] = extractBasicFieldProps<PhoneNumberInputProps>(props, useId())
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...basicFieldProps}
         >
            <PhoneInput
               id={basicFieldProps.id}
               className={cn(
                  "flex relative",
                  className,
               )}
               defaultCountry={defaultCountry as CountryCode}
               addInternationalOption={false}
               control={null}
               style={{ display: 'flex', position: 'relative' }}
               countrySelectProps={{
                  className: cn(
                     inputStyles({ size, intent, incorrect: !!basicFieldProps.error ? "yes" : "no" }),
                     "flex-none w-[4.5rem] truncate rounded-r-none border-r-0 focus:border-gray-300",
                  ),
                  disabled: basicFieldProps.isDisabled,
               }}
               numberInputProps={{
                  className: cn(
                     inputStyles({ size, intent, incorrect: !!basicFieldProps.error ? "yes" : "no" }),
                     {
                        "bg-gray-50 border-gray-200 text-gray-500 shadow-none pointer-events-none": basicFieldProps.isDisabled,
                     },
                     "rounded-l-none border-l-transparent",
                  ),
                  disabled: basicFieldProps.isDisabled,
               }}
               flagComponent={(flag) => (
                  <img
                     className="w-6 absolute h-full inset-y-0 ml-3"
                     src={flag.flagUrl?.replace('{XX}', flag.country)}
                     // onClick={() => { countrySelectRef.current?.focus() }}
                  />
               )}
               value={value as E164Number}
               onChange={onChange}
               // ref={ref as any}
            />
         </BasicField>
      </>
   )
   
})
