import { cn } from '@/lib/tailwind/tailwind-utils'
import { MaybeRenderProp } from '@/types'
import { runIfFn } from '@/utils/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@ui/main/layout/stack/Stack'
import React, { createContext, useContext, useEffect } from 'react'
import { FieldValues, FormProvider, SubmitErrorHandler, SubmitHandler, useForm, UseFormProps, UseFormReturn, WatchObserver } from 'react-hook-form'
import { z } from 'zod'

export interface TypesafeFormProps<TFields extends FieldValues = FieldValues>
   extends UseFormProps<TFields>,
      Omit<React.ComponentPropsWithRef<"form">, 'children' | 'onChange' | 'onSubmit' | 'onError' | 'ref'> {
   schema: z.ZodObject<z.ZodRawShape>
   onSubmit: SubmitHandler<TFields>
   onChange?: WatchObserver<TFields> // Triggers when any of the field change.
   onError?: SubmitErrorHandler<TFields> // Triggers when there are validation errors.
   formRef?: React.RefObject<HTMLFormElement>
   children?: MaybeRenderProp<UseFormReturn<TFields>>
   stackClassName?: string
   defaultValues?: any
   mRef?: React.Ref<UseFormReturn<TFields>>
}

export const TypesafeForm = <TFields extends FieldValues>(props: TypesafeFormProps<TFields>) => {
   
   const {
      mode = 'onTouched',
      resolver,
      reValidateMode,
      shouldFocusError,
      shouldUnregister,
      shouldUseNativeValidation,
      criteriaMode,
      delayError,
      schema,
      defaultValues,
      onChange,
      onSubmit,
      onError,
      formRef,
      children,
      mRef,
      
      stackClassName,
      ...rest
   } = props
   
   const form = {
      mode,
      resolver,
      defaultValues,
      reValidateMode,
      shouldFocusError,
      shouldUnregister,
      shouldUseNativeValidation,
      criteriaMode,
      delayError,
   }
   
   form.resolver = zodResolver(schema)
   
   const methods = useForm(form)
   const { handleSubmit } = methods
   
   React.useImperativeHandle(mRef, () => methods, [mRef, methods])
   
   useEffect(() => {
      let subscription: any
      if (onChange) {
         subscription = methods.watch(onChange)
      }
      return () => subscription?.unsubscribe()
   }, [methods, onChange])
   
   return (
      <>
         <FormProvider {...methods}>
            <FormSchemaContext.Provider value={schema.shape}>
               <form
                  ref={formRef}
                  onSubmit={handleSubmit(onSubmit, onError)}
                  {...rest}
               >
                  <Stack className={cn("w-full gap-3", stackClassName)}>
                     {runIfFn(children, methods)}
                  </Stack>
               </form>
            </FormSchemaContext.Provider>
         </FormProvider>
      </>
   )
   
}

const FormSchemaContext = createContext<z.ZodRawShape | undefined>(undefined)

export const useFormSchema = (): z.ZodRawShape | undefined => {
   return useContext(FormSchemaContext)
}
