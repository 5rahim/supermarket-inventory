import { useDisclosure } from '@/hooks/use-disclosure'
import { cn } from '@/lib/tailwind/tailwind-utils'
import { Transition } from '@headlessui/react'
import { Badge } from '@ui/main/data-display/badge/Badge'
import { BasicField, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { inputContainerStyle, inputLeftAddon, inputLeftIcon, inputRootStyle, TextInputProps } from '@ui/main/forms/input/TextInput'
import _ from 'lodash'
import React, { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

export type MultiSelectOption = { value: string, label?: string, description?: string, image?: React.ReactNode }

export interface MultiSelectProps extends Omit<TextInputProps, "defaultValue" | "onChange"> {
   options: MultiSelectOption[]
   defaultValue?: MultiSelectOption['value'][]
   onChange?: (values: MultiSelectOption['value'][]) => void
   isLoading?: boolean
   discrete?: boolean
   max?: number
}


export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>((props, ref) => {
   
   const [{
      children,
      className,
      size = "md",
      intent = "basic",
      isLoading,
      leftAddon,
      leftIcon,
      options,
      defaultValue,
      placeholder,
      onChange,
      max,
      discrete = false,
      ...rest
   }, basicFieldProps] = extractBasicFieldProps<MultiSelectProps>(props, useId())
   
   
   const inputRef = useRef<HTMLInputElement>(null)
   const ulRef = useRef<HTMLUListElement>(null)
   const [values, setValues] = useState<MultiSelectOption['value'][]>(defaultValue ?? [])
   const [tagInputValue, setTagInputValue] = useState('')
   const inputFocused = useDisclosure(false)
   const listDisclosure = useDisclosure(false)
   
   const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0)
   
   const selectOptions = useMemo(() => {
      // if user types an input, filter by similar labels or values
      // else show options which are not selected
      const filtered = _.filter(options, o => !values.includes(o.value))
      return tagInputValue.length > 0 ? _.filter(filtered, o => (o.label
         ? o.label.toLowerCase().includes(tagInputValue.toLowerCase())
         : o.value.toLowerCase().includes(tagInputValue.toLowerCase()))) : filtered
   }, [values, tagInputValue, options])
   
   useEffect(() => {
      onChange && onChange(values)
   }, [values])
   
   function handleAddValue(value: string) {
      if (!!max) {
         if (max !== 1 && values.length < max) {
            setValues([...values, value])
         }
         if (max !== 1 && values.length >= max) {
            setValues([...values.slice(0, values.length - 1), value])
         }
         if (max === 1) {
            setValues([value])
         }
      }
      if (!max) {
         setValues([...values, value])
      }
   }
   
   function handlePopValue() {
      setValues(v => v.slice(0, v.length - 1))
   }
   
   function handleRemoveValue(value: string) {
      setValues(v => v.filter(a => a !== value))
   }
   
   
   const closeList = () => {
      listDisclosure.close()
   }
   
   /**
    * When the user is focused on the input and hits enter,
    * if the there's only one option and the tagInputValue is not empty, add the option to the selected values
    * @param event
    */
   const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Enter' && inputRef.current) {
         if (selectOptions.length === 1 && selectOptions[0] && tagInputValue.length > 0) {
            handleAddValue(selectOptions[0].value) // Add value
            setTagInputValue('') // Reset input
            closeList() // Close list
         }
         if (tagInputValue.length === 0 && selectOptions[highlightedOptionIndex]) {
            handleAddValue(selectOptions[highlightedOptionIndex]!.value)
            setHighlightedOptionIndex(0)
         }
      }
      if ((event.key === 'Backspace' || event.key === 'Delete') && tagInputValue.length === 0) {
         handlePopValue()
      }
   }, [selectOptions, highlightedOptionIndex, tagInputValue])
   
   const handleKeyUp = useCallback((e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
         setHighlightedOptionIndex(i => {
            const newI = (i + 1) <= (selectOptions.length - 1) ? (i + 1) : 0
            scrollToHighlighted(newI)
            return newI
         })
      }
      if (e.key === 'ArrowUp') {
         setHighlightedOptionIndex(i => {
            const newI = (i - 1) >= 0 ? (i - 1) : (selectOptions.length - 1)
            scrollToHighlighted(newI)
            return newI
         })
      }
   }, [selectOptions])
   
   useEffect(() => {
      
      window.addEventListener('keyup', handleKeyUp)
      if (inputRef.current) {
         inputRef.current.addEventListener('keydown', handleKeyDown)
      }
      
      return () => {
         if (inputRef.current) {
            inputRef.current.removeEventListener('keydown', handleKeyDown)
         }
         window.removeEventListener('keyup', handleKeyUp)
      }
   }, [inputRef, listDisclosure, selectOptions, highlightedOptionIndex])
   
   const itemsRef = useRef<any>(null)
   
   function getMap() {
      if (!itemsRef.current) {
         // Initialize the Map on first usage.
         itemsRef.current = new Map()
      }
      return itemsRef.current
   }
   
   function scrollToHighlighted(index: number) {
      const map = getMap()
      const node = map.get(index)
      if (index === selectOptions.length - 1) {
         ulRef.current?.scrollTo({ top: ulRef.current?.scrollHeight, behavior: 'smooth' })
      } else if (index === 0) {
         ulRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
         node?.scrollIntoView({
            // behavior: 'smooth',
            block: 'nearest',
            inline: 'end',
         })
      }
   }
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...basicFieldProps}
         >
            <div className={cn(inputContainerStyle())}>
               {inputLeftAddon(leftAddon, leftIcon)}
               {inputLeftIcon(leftIcon)}
               <div
                  className={cn(
                     "form-input relative flex flex-wrap gap-2 cursor-text",
                     inputRootStyle({
                        size, intent, isDisabled: basicFieldProps.isDisabled || isLoading, hasError: !!basicFieldProps.error, leftIcon, leftAddon,
                     }),
                     { "border-indigo-500 hover:border-indigo-500 ring-1 ring-indigo-500": inputFocused.isOpen },
                  )}
                  onClick={(e) => {
                     if (!inputFocused.isOpen && !isLoading) {
                        inputRef.current?.focus()
                     }
                  }}
               >
                  
                  
                  {isLoading ? (
                     <p>Loading...</p>
                  ) : <>
                     
                     {values.map((value, index) => (
                        <span key={index}>
                           <Badge
                              tag
                              size="lg"
                              intent={discrete ? "basic" : "gray"}
                              isClosable={!basicFieldProps.isDisabled && !discrete}
                              onClose={() => handleRemoveValue(value)}
                              className={cn({ "px-1": discrete })}
                           >
                              <span>{_.find(options, ['value', value])?.label ?? _.find(options, ['value', value])?.value}</span>
                           </Badge>
                        </span>
                     ))}
                     <input
                        id={basicFieldProps.id}
                        placeholder=""
                        value={tagInputValue}
                        onChange={e => {
                           inputFocused.open()
                           setTagInputValue(e.target.value ?? '')
                           if (selectOptions.length > 0) {
                              listDisclosure.open()
                           }
                        }}
                        onFocus={() => {
                           inputFocused.open()
                           listDisclosure.open()
                        }}
                        onClick={() => {
                           inputFocused.open()
                           listDisclosure.open()
                        }}
                        onBlur={() => {
                           setTimeout(() => {
                              inputFocused.close()
                              listDisclosure.close()
                           }, 200)
                        }}
                        onKeyPress={e => {
                           e.key === 'Enter' && e.preventDefault()
                        }}
                        disabled={basicFieldProps.isDisabled || isLoading}
                        className={cn("outline-none", { "w-1": !inputFocused.isOpen })}
                        ref={inputRef}
                     />
                     <Transition
                        show={listDisclosure.isOpen && selectOptions.length > 0}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                     >
                        <ul
                           className="absolute z-10 -bottom-2 left-0 translate-y-full max-h-56 w-full overflow-auto rounded-md bg-white p-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                           ref={ulRef}
                        >
                           {selectOptions.map((o, index) => {
                              
                              const imageComponent = o.image ?
                                 <div className="flex-none justify-center w-8 h-8 mr-3 rounded-full overflow-hidden relative bg-slate-200">
                                    {o.image}
                                 </div> : <></>
                              
                              return (
                                 <li
                                    key={o.value}
                                    className={cn(
                                       'relative cursor-pointer py-2 pl-3 pr-9 rounded-md',
                                       {
                                          "bg-gray-100 hover:bg-gray-100": highlightedOptionIndex === index,
                                       },
                                    )}
                                    onClick={() => {
                                       handleAddValue(o.value)
                                       setTagInputValue('')
                                    }}
                                    onMouseMove={() => {
                                       setHighlightedOptionIndex(index)
                                    }}
                                    ref={(node) => {
                                       const map = getMap()
                                       if (node) {
                                          map.set(index, node)
                                       } else {
                                          map.delete(index)
                                       }
                                    }}
                                 >
                                    <div className="flex w-full items-center">
                                       {imageComponent}
                                       <div>
                                          <div
                                             className={cn('text-base block truncate')}
                                          >
                                             {o.label ?? o.value}
                                          </div>
                                          {o.description && <div className={cn('text-sm opacity-70')}>{o.description}</div>}
                                       </div>
                                    </div>
                                 </li>
                              )
                           })}
                        </ul>
                     </Transition>
                  
                  </>}
               </div>
            </div>
         </BasicField>
      </>
   )
   
})
