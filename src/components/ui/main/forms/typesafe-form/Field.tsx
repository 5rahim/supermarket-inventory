import { callAllHandlers } from '@/utils/components'
import { createPolymorphicComponent } from '@/utils/polymorphic-component'
import { BasicFieldOptions } from '@ui/main/forms/basic-field/BasicField'
import { Checkbox, CheckboxProps } from '@ui/main/forms/checkbox/Checkbox'
import { CheckboxGroup, CheckboxGroupProps } from '@ui/main/forms/checkbox/CheckboxGroup'
import { DatePicker, DatePickerProps } from '@ui/main/forms/date-time/date-picker/DatePicker'
import { DateRangePicker, DateRangePickerProps } from '@ui/main/forms/date-time/date-picker/DateRangePicker'
import { TimeInput, TimeInputProps } from '@ui/main/forms/date-time/date-picker/TimeInput'
import { NumberInput, NumberInputProps } from '@ui/main/forms/input/NumberInput'
import { PriceInput, PriceInputProps } from '@ui/main/forms/input/PriceInput'
import { TextInput, TextInputProps } from '@ui/main/forms/input/TextInput'
import { MultiSelect, MultiSelectProps } from '@ui/main/forms/multi-select/MultiSelect'
import { PhoneNumberInput, PhoneNumberInputProps } from '@ui/main/forms/phone-number-input/PhoneNumberInput'
import { RadioGroup, RadioGroupProps } from '@ui/main/forms/radio/RadioGroup'
import { Select, SelectProps } from '@ui/main/forms/select/Select'
import { Switch, SwitchProps } from '@ui/main/forms/switch/Switch'
import { Textarea, TextareaProps } from '@ui/main/forms/textarea/Textarea'
import { SubmitField } from '@ui/main/forms/typesafe-form/SubmitField'
import { useFormSchema } from '@ui/main/forms/typesafe-form/TypesafeForm'
import React, { forwardRef, useMemo } from 'react'
import { Controller, FormState, get, useController, useFormContext } from 'react-hook-form'


export interface FieldBaseProps extends Omit<BasicFieldOptions, "name"> {
   name: string
   onChange?: any
   onBlur?: any
   isRequired?: boolean
}

type FieldComponent<T> = T & FieldBaseProps

export interface FieldProps extends React.ComponentPropsWithRef<'div'> {

}

const _Field: any = {}

export function withControlledInput<T extends FieldBaseProps>(InputComponent: React.FC<T>) {
   return forwardRef<FieldProps, T>(
      (props, ref) => {
         const { control, formState } = useFormContext()
         const schema = useFormSchema()
         
         const isRequired = useMemo(() => !!get(schema, props.name)?.nonempty, [schema])
         
         return (
            <Controller
               name={props.name}
               control={control}
               rules={{ required: props.isRequired }}
               render={(render) => (
                  <InputComponent
                     {...props} // BasicFieldOptions and other component specific props...
                     defaultValue={get(formState.defaultValues, props.name)}
                     onChange={callAllHandlers(props.onChange, render.field.onChange)}
                     onBlur={callAllHandlers(props.onBlur, render.field.onBlur)}
                     error={getFormError(render.field.name, render.formState)?.message}
                     isRequired={isRequired}
                     ref={ref}
                  />
               )}
            />
         )
      },
   )
}

/**
 * Causes hydration issues because it populates the input once the component is rendered on the client
 */
export const withUncontrolledInput = <T extends FieldBaseProps>(InputComponent: React.FC<T>) => {
   return forwardRef<HTMLInputElement, T>(
      (props, ref) => {
         const { register, formState } = useFormContext()
         const { ref: _ref, ...field } = register(props.name)
         
         return (
            <InputComponent
               {...props}
               onChange={callAllHandlers(props.onChange, field.onChange)}
               onBlur={callAllHandlers(props.onBlur, field.onBlur)}
               error={getFormError(props.name, formState)?.message}
               name={field.name}
               ref={useMergeRefs(ref, _ref)}
            />
         )
      },
   )
}

export const TextInputField = React.memo(withControlledInput<FieldComponent<TextInputProps>>(forwardRef<HTMLInputElement, FieldComponent<TextInputProps>>(
   (props, ref) => {
      return <TextInput {...props} ref={ref} />
   },
)))
export const TextareaField = React.memo(withControlledInput<FieldComponent<TextareaProps>>(forwardRef<HTMLTextAreaElement, FieldComponent<TextareaProps>>(
   (props, ref) => {
      return <Textarea {...props} ref={ref} />
   },
)))
export const SelectField = React.memo(withControlledInput<FieldComponent<SelectProps>>(forwardRef<HTMLSelectElement, FieldComponent<SelectProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <Select
         defaultValue={get(context.formState.defaultValues, props.name)}
         {...props}
         ref={ref}
      />
   },
)))
export const NumberField = React.memo(withControlledInput<FieldComponent<NumberInputProps>>(forwardRef<HTMLInputElement, FieldComponent<NumberInputProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <NumberInput
         {...props}
         defaultValue={get(context.formState.defaultValues, props.name)}
         ref={ref}
      />
   },
)))
export const MultiSelectField = React.memo(withControlledInput<FieldComponent<MultiSelectProps>>(forwardRef<HTMLInputElement, FieldComponent<MultiSelectProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <MultiSelect
         {...props}
         defaultValue={get(context.formState.defaultValues, props.name)}
         ref={ref}
      />
   },
)))

export const SwitchField = React.memo(withControlledInput<FieldComponent<SwitchProps>>(forwardRef<HTMLDivElement, FieldComponent<SwitchProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <Switch
         {...props}
         defaultChecked={get(context.formState.defaultValues, props.name)}
         ref={ref}
      />
   },
)))
export const CheckboxField = React.memo(withControlledInput<FieldComponent<CheckboxProps>>(forwardRef<HTMLDivElement, FieldComponent<CheckboxProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <Checkbox {...props} defaultChecked={get(context.formState.defaultValues, props.name)} ref={ref} />
   },
)))
export const CheckboxGroupField = React.memo(withControlledInput<FieldComponent<CheckboxGroupProps>>(forwardRef<HTMLDivElement, FieldComponent<CheckboxGroupProps>>(
   ({ name, ...props }, ref) => {
      const context = useFormContext()
      const control = useController({ name: name })
      return <CheckboxGroup
         name={name}
         onChange={control.field.onChange}
         defaultValues={get(context.formState.defaultValues, name)}
         error={get(context.formState.errors, name)?.message}
         {...props}
         ref={ref}
      />
   },
)))
export const RadioGroupField = React.memo(withControlledInput<FieldComponent<RadioGroupProps>>(forwardRef<HTMLInputElement, FieldComponent<RadioGroupProps>>(
   ({ name, ...props }, ref) => {
      const context = useFormContext()
      const control = useController({ name: name })
      return <RadioGroup
         name={name}
         onChange={control.field.onChange}
         defaultValue={get(context.formState.defaultValues, name)}
         error={get(context.formState.errors, name)?.message}
         {...props}
         ref={ref}
      />
   },
)))

export const RadioCardsField = React.memo(withControlledInput<FieldComponent<RadioGroupProps>>(forwardRef<HTMLInputElement, FieldComponent<RadioGroupProps>>(
   ({ name, ...props }, ref) => {
      const context = useFormContext()
      const control = useController({ name: name })
      return <RadioGroup
         name={name}
         onChange={control.field.onChange}
         defaultValue={get(context.formState.defaultValues, name)}
         error={get(context.formState.errors, name)?.message}
         fieldClassName="flex w-full"
         fieldLabelClassName="text-base sm:text-base md:text-base"
         stackClassName="flex flex-col md:flex-row gap-2"
         radioWrapperClassName="block w-full p-4 cursor-pointer transition border border-gray-200 rounded-md data-checked:bg-white data-checked:ring-2 data-checked:ring-brand-500"
         radioControlClassName="absolute right-2 top-2 h-5 w-5 text-xs"
         radioLabelClassName="font-semibold flex-none flex"
         radioHelpClassName="text-sm"
         {...props}
         ref={ref}
      />
   },
)))


export const SegmentedControlField = React.memo(withControlledInput<FieldComponent<RadioGroupProps>>(forwardRef<HTMLInputElement, FieldComponent<RadioGroupProps>>(
   ({ name, ...props }, ref) => {
      const context = useFormContext()
      const control = useController({ name: name })
      return <RadioGroup
         name={name}
         onChange={control.field.onChange}
         defaultValue={get(context.formState.defaultValues, name)}
         error={get(context.formState.errors, name)?.message}
         fieldClassName="flex w-full"
         fieldLabelClassName="text-md"
         stackClassName="flex flex-row gap-2 p-1 bg-gray-50 rounded-md border w-[fit-content]"
         radioWrapperClassName="block w-[fit-content] py-1 px-3 cursor-pointer border border-transparent transition rounded-md data-checked:bg-white data-checked:border-gray-300 data-checked:shadow-sm text-gray-500 data-checked:text-black"
         radioControlClassName="hidden"
         radioLabelClassName="font-semibold flex-none flex"
         radioHelpClassName="text-base"
         {...props}
         ref={ref}
      />
   },
)))

export const DatePickerField =
   React.memo(withControlledInput<FieldComponent<DatePickerProps>>(forwardRef<HTMLDivElement, FieldComponent<DatePickerProps>>((props, ref) => {
         const context = useFormContext()
         return <DatePicker defaultValue={get(context.formState.defaultValues, props.name)} {...props} ref={ref} />
      },
   )))
export const DateRangePickerField = React.memo(withControlledInput<FieldComponent<DateRangePickerProps>>(forwardRef<HTMLDivElement,
   FieldComponent<DateRangePickerProps>>((props, ref) => {
   const context = useFormContext()
   return <DateRangePicker
      defaultValue={get(context.formState.defaultValues, props.name)} {...props} ref={ref}
   />
})))
export const TimeField =
   React.memo(withControlledInput<FieldComponent<TimeInputProps>>(forwardRef<HTMLDivElement, FieldComponent<TimeInputProps>>((props, ref) => {
         const context = useFormContext()
         return <TimeInput defaultValue={get(context.formState.defaultValues, props.name)} {...props} ref={ref} />
      },
   )))

type PhoneNumberInputFieldProps = Omit<PhoneNumberInputProps, "onChange" | "value">
export const PhoneNumberInputField = React.memo(withControlledInput<FieldComponent<PhoneNumberInputFieldProps>>(forwardRef<HTMLInputElement, FieldComponent<PhoneNumberInputFieldProps>>(
   (props, ref) => {
      const context = useFormContext()
      const controller = useController({ name: props.name })
      return <PhoneNumberInput
         {...props}
         onChange={callAllHandlers(props.onChange, controller.field.onChange)}
         value={get(context.formState.defaultValues, props.name)}
      />
   },
)))

export const PriceInputField = React.memo(withControlledInput<FieldComponent<PriceInputProps>>(forwardRef<HTMLInputElement, FieldComponent<PriceInputProps>>(
   (props, ref) => {
      const context = useFormContext()
      return <PriceInput
         {...props}
         defaultValue={get(context.formState.defaultValues, props.name) ?? 0}
         country={"us"}
         locale={"en"}
         ref={ref}
      />
   },
)))


_Field.Text = TextInputField
_Field.Textarea = TextareaField
_Field.Select = SelectField
_Field.Switch = SwitchField
_Field.Checkbox = CheckboxField
_Field.CheckboxGroup = CheckboxGroupField
_Field.RadioGroup = RadioGroupField
_Field.RadioCards = RadioCardsField
_Field.SegmentedControl = SegmentedControlField
_Field.PhoneNumber = PhoneNumberInputField
_Field.Number = NumberField
_Field.MultiSelect = MultiSelectField
_Field.Price = PriceInputField
_Field.DatePicker = DatePickerField
_Field.DateRangePicker = DateRangePickerField
_Field.Time = TimeField
_Field.Submit = SubmitField

export const Field = createPolymorphicComponent<'div', FieldProps, {
   Text: typeof TextInputField,
   Textarea: typeof TextareaField,
   Select: typeof SelectField,
   Switch: typeof SwitchField,
   Checkbox: typeof CheckboxField,
   CheckboxGroup: typeof CheckboxGroupField,
   RadioGroup: typeof RadioGroupField,
   RadioCards: typeof RadioCardsField,
   SegmentedControl: typeof SegmentedControlField,
   PhoneNumber: typeof PhoneNumberInputField,
   Number: typeof NumberField,
   MultiSelect: typeof MultiSelectField,
   Price: typeof PriceInputField,
   DatePicker: typeof DatePickerField
   DateRangePicker: typeof DateRangePickerField
   Time: typeof TimeField
   Submit: typeof SubmitField
}>(_Field)


// Utils
export const getFormError = (name: string, formState: FormState<{ [x: string]: any }>) => {
   return get(formState.errors, name)
}


export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>

export function assignRef<T = any>(
   ref: ReactRef<T> | null | undefined,
   value: T,
) {
   if (ref == null) return
   
   if (typeof ref === "function") {
      ref(value)
      return
   }
   
   try {
      ref.current = value
   }
   catch (error) {
      throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
   }
}

export function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
   return (node: T | null) => {
      refs.forEach((ref) => {
         assignRef(ref, node)
      })
   }
}

export function useMergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
   // eslint-disable-next-line react-hooks/exhaustive-deps
   return useMemo(() => mergeRefs(...refs), refs)
}

const isTouched = (
   name: string,
   formState: FormState<{ [x: string]: any }>,
) => {
   return get(formState.touchedFields, name)
}

export type As<Props = any> = React.ElementType<Props>
