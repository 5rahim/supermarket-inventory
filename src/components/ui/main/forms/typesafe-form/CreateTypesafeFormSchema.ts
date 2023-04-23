import { TypesafeFormProps } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { FieldValues } from 'react-hook-form'
import { z as zod } from 'zod'

const schemaPresets = {
   name: zod.string().min(2).trim(),
   imageGrid: zod.array(zod.any()).min(1, 'no_image'),
   dropzone: zod.array(zod.any()).min(1, 'no_image'),
   phone: zod.string().min(10, 'form:phone.invalid'),
   price: zod.number().min(0),
   switch: zod.boolean(),
   checkbox: zod.boolean(),
   select: zod.string().min(1, 'select_one'),
   checkboxGroup: zod.array(zod.string()).min(1, 'select_at_least_one'),
   multiSelect: zod.array(zod.string()).min(1, 'select_at_least_one'),
   radioGroup: zod.string().min(1),
   segmentedControl: zod.string().min(1),
   dateRangePicker: zod.object({ start: zod.date(), end: zod.date() }),
   time: zod.object({ hour: zod.number().min(0), minute: zod.number().min(0) }),
}
type DataSchemaCallback<S extends zod.ZodRawShape> = ({ z, presets }: { z: typeof zod, presets: typeof schemaPresets }) => zod.ZodObject<S>
export const createTypesafeFormSchema = <S extends zod.ZodRawShape>(callback: DataSchemaCallback<S>): zod.ZodObject<S> => {
   return callback({ z: zod, presets: schemaPresets })
}

export type CreateTypesafeFormProps<Schema extends FieldValues> = {
   schema: TypesafeFormProps<Schema>['schema']
   onSubmit: TypesafeFormProps<Schema>['onSubmit']
   defaultValues?: TypesafeFormProps<Schema>['defaultValues']
}

export function createTypesafeForm<Schema extends FieldValues>({
   onSubmit, schema, defaultValues, ...rest
}: CreateTypesafeFormProps<Schema>): TypesafeFormProps<Schema> {
   return {
      onSubmit,
      schema,
      defaultValues,
      ...rest,
   }
}
