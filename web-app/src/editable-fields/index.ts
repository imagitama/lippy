import React from 'react'

import { fieldTypes } from '@/generic-forms'

import { ImageUploaderConfig } from '@/components/image-uploader/lazy'
import { TagsInputSettings } from '@/components/tags-input'

import { GenericInputProps } from '@/components/generic-editor/types'

export interface Option {
  value: string | null
  label: string
  subLabel?: string | React.ReactElement
}

export interface EditableFieldBase<TRecord> {
  type: fieldTypes
  name: keyof TRecord
  label?: string // optional for hidden fields
  default?: any
  hint?: string
  isRequired?: boolean
  isEditable?: boolean
  length?: number
  multiline?: true
  section?: string
  allowEmpty?: boolean // if boolean column can be "empty" or undefined
  overrideValue?: any
}

export interface TextEditableField<TRecord>
  extends ImageUploaderConfig,
    EditableFieldBase<TRecord> {
  type: fieldTypes.text
  minLength?: number
  maxLength?: number
  emptyAsNull?: boolean
}

export interface SelectEditableField<TRecord>
  extends ImageUploaderConfig,
    EditableFieldBase<TRecord> {
  type: fieldTypes.singlechoice | fieldTypes.multichoice | fieldTypes.dropdown
  options: Option[] | ((fields: Partial<TRecord>) => Option[])
}

export interface ImageUploadEditableField<TRecord>
  extends ImageUploaderConfig,
    EditableFieldBase<TRecord> {
  type: fieldTypes.imageUpload
  getDirectoryPath?: (record: TRecord) => string
}

export interface SearchableEditableField<TRecord>
  extends EditableFieldBase<TRecord> {
  type: fieldTypes.searchable
  collectionName: string
  fieldAsLabel: string
  renderer: (props: { item: any }) => React.ReactElement
  allowManualEntry?: boolean // tag suggestion allow typing a custom tag
}

export type CustomEditableField<
  TRecord extends Record<string, any>,
  K extends keyof TRecord = keyof TRecord
> = K extends keyof TRecord // distributes over each key
  ? EditableFieldBase<TRecord> & {
      type: fieldTypes.custom
      name: K
      renderer: (
        props: GenericInputProps<TRecord[K], TRecord, EditableField<TRecord>>
      ) => React.ReactElement
    }
  : never

export interface ItemEditableField<TRecord> extends EditableFieldBase<TRecord> {
  type: fieldTypes.item
  collectionName: string
  fieldAsLabel?: string
  getLabel?: (item: any) => string
}

export interface DateRangeEditableField<TRecord>
  extends EditableFieldBase<TRecord> {
  type: fieldTypes.dateRange
  startsAtFieldName: Extract<keyof TRecord, string>
  endsAtFieldName: Extract<keyof TRecord, string>
}

export interface CheckboxEditableField<TRecord>
  extends EditableFieldBase<TRecord> {
  type: fieldTypes.checkbox
  checkboxLabel?: string
}

export interface UrlEditableField<TRecord> extends EditableFieldBase<TRecord> {
  type: fieldTypes.url
}

export interface TagEditableField<TRecord>
  extends TagsInputSettings,
    EditableFieldBase<TRecord> {
  type: fieldTypes.tags
  suggestedTags?: string[]
}

export interface MarkdownEditableField<TRecord>
  extends TagsInputSettings,
    EditableFieldBase<TRecord> {
  type: fieldTypes.textMarkdown
  allowImages?: boolean
}

export interface JsonEditableField<TRecord> extends EditableFieldBase<TRecord> {
  type: fieldTypes.json
  json: EditableField<any>[]
}

export type EditableField<TRecord extends Record<string, any>> =
  | TextEditableField<TRecord>
  | DateRangeEditableField<TRecord>
  | CheckboxEditableField<TRecord>
  | ImageUploadEditableField<TRecord>
  | SearchableEditableField<TRecord>
  | CustomEditableField<TRecord>
  | ItemEditableField<TRecord>
  | UrlEditableField<TRecord>
  | TagEditableField<TRecord>
  | SelectEditableField<TRecord>
  | MarkdownEditableField<TRecord>
  | JsonEditableField<TRecord>
  | EditableFieldBase<TRecord>
