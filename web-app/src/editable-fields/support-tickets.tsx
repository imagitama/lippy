import {
  SupportTicket,
  supportTicketCategoryMeta,
} from 'shared/modules/supporttickets'
import { EditableField } from '.'
import { fieldTypes } from '@/generic-forms'

const editableFields: EditableField<SupportTicket>[] = [
  // {
  //   name: 'relatedtable',
  //   type: fieldTypes.custom,
  //   renderer: ({ formFields }) => (
  //     <GenericOutputItem
  //       type={formFields.relatedtable!}
  //       id={formFields.relatedid!}
  //     />
  //   ),
  // },
  // {
  //   name: 'relatedid',
  //   type: fieldTypes.hidden,
  // },
  {
    name: 'category',
    label: 'Category',
    type: fieldTypes.dropdown,
    options: Object.entries(supportTicketCategoryMeta).map(
      ([categoryName, meta]) => ({
        value: categoryName,
        label: meta.label,
        subLabel: meta.description,
      })
    ),
    isRequired: true,
  },
  {
    name: 'comments',
    label: 'Comments',
    type: fieldTypes.text,
    hint: 'What is your support ticket about? Please add as much information as possible.',
    multiline: true,
    isRequired: true,
  },
]

export default editableFields
