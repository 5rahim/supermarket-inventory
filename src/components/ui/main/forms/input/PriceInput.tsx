'use client'

import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { TextInput, TextInputProps } from '@ui/main/forms/input/TextInput'
import Dinero from 'dinero.js'
import React, { ChangeEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'


export interface PriceInputProps extends Omit<TextInputProps, "value" | "onChange" | "defaultValue"> {
   value?: number
   defaultValue?: number
   onChange?: (value: number) => void
   locale?: string
   country?: string
   leftAddon?: string | undefined
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>((props, ref) => {
   
   const [{
      className,
      size = "md",
      value,
      defaultValue = 0,
      locale = 'en',
      country = 'ci',
      intent,
      onChange,
      leftAddon,
      leftIcon,
      placeholder,
   }, basicFieldProps] = extractBasicFieldProps<PriceInputProps>(props, useId())
   
   const [amount, setAmount] = useState<number>(value ?? defaultValue)
   const [isEditing, setIsEditing] = useState(false)
   const editInputRef = useRef<HTMLInputElement>(null)
   
   const dineroObject = useMemo(() => {
      return Dinero({ amount: amount, currency: 'USD' }).setLocale(locale)
   }, [amount])
   
   const formattedValue = useMemo(() => {
      return dineroObject.toFormat()
   }, [dineroObject])
   
   const [inputValue, setInputValue] = useState(formatNumber(dineroObject.toUnit().toString(), locale))
   
   useEffect(() => {
      onChange && onChange((dineroObject.toUnit() * 100))
   }, [dineroObject])
   
   const localizedPattern = useCallback((value: string) => {
      let incorrectSeparator = ','
      // Locale that use ',' as separator add it to the condition: if(locale.includes('fr') || locales.includes('xx'))
      if (locale.includes('fr')) incorrectSeparator = '.'
      return truncateAfterSecondDecimal(removeNonNumericCharacters(value)).replaceAll(incorrectSeparator, '')
   }, [])
   
   const toFloat = useCallback((value: string) => {
      return extractFloat(truncateAfterSecondDecimal(removeNonNumericCharacters(value)).replaceAll(',', '.'))
   }, [])
   
   function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
      
      let _amount = 0
      let _value = ""
      try {
         _value = localizedPattern(event.target.value)
         _amount = _value.length > 0 ? toFloat(event.target.value) : 0
      }
      catch (e) {
         setInputValue("0")
         setAmount((_amount ?? 0) * 100)
      }
      setAmount(_amount * 100)
      setInputValue(_value)
   }
   
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-0")}
            {...basicFieldProps}
            ref={ref}
         >
            <div className={cn("flex items-center gap-2", className)}>
               <TextInput
                  value={isEditing ? inputValue : formattedValue}
                  onChange={handleOnChange}
                  error={basicFieldProps.error}
                  isDisabled={basicFieldProps.isDisabled}
                  onBlur={() => {
                     setInputValue(v => formatNumber(dineroObject.toUnit().toString(), locale))
                     setIsEditing(false)
                  }}
                  onFocus={() => {
                     setIsEditing(true)
                  }}
                  leftAddon={leftAddon}
                  leftIcon={leftIcon}
                  size={size}
                  intent={intent}
                  ref={editInputRef}
               />
            
            </div>
         </BasicField>
      </>
   )
   
})

function extractFloat(input: string): number {
   // Use a regular expression to remove any non-numeric characters
   const floatString = input.replace(/[^\d.-]/g, "")
   
   // Convert the extracted string to a float and return it
   return parseFloat(floatString)
}

function removeNonNumericCharacters(input: string): string {
   return input.replace(/[^0-9,.]\s/g, '') ?? input
}

function truncateAfterSecondDecimal(input: string): string {
   if (input.length === 0) return ''
   const regex = /^([^,.]+)?([,.]\d{0,2})?/
   const match = regex.exec(input)
   if (!match) {
      return input
   }
   return match[1] + (match[2] || '')
}

function formatNumber(input: string | undefined, lang: string): string {
   // Parse the input string to a number
   let inputAsNumber = parseFloat(input ?? "0")
   if (isNaN(inputAsNumber)) {
      // If the input is not a valid number, return an empty string
      return "0"
   }
   
   // Multiply the input by 100 to ensure that it has 2 decimal places
   const inputWithDecimals = inputAsNumber
   
   // Use the Intl object to format the number with 2 decimal places
   const formattedNumber = new Intl.NumberFormat(lang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(inputWithDecimals)
   
   // Return the formatted number as a string
   // return formattedNumber.replaceAll(/\s/g, '')
   return formattedNumber
}

function formatDecimal(str: string, lang: string) {
   // Use a regular expression to extract all the numbers from the string
   const numbers = str.match(/\d+\.\d+|\d+/g)
   
   // Set the decimal point character based on the language
   let decimalPoint = '.'
   if (lang.includes('fr')) {
      decimalPoint = ','
   }
   
   // Return the formatted string
   return numbers?.map(n => n.replace('.', decimalPoint)).join(' ')
}
