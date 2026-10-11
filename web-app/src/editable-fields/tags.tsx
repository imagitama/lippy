import { fieldTypes } from '@/generic-forms'
import { EditableField } from '.'
import { type Tag } from 'shared/modules/tags'
import { categories } from '@/utils/tags'
import * as icons from '@/icons'

const editableFields: EditableField<Tag>[] = [
  {
    name: 'id',
    label: 'Tag',
    type: fieldTypes.text,
    hint: 'Do not edit after creation',
  },
  {
    name: 'label',
    label: 'Label',
    type: fieldTypes.text,
    hint: 'User-friendly version of the tag - will be generated from the tag if nothing is set',
  },
  {
    name: 'category',
    label: 'Category',
    type: fieldTypes.text,
    hint: `A way to group tags. Categories: ${Object.values(categories).join(
      ', '
    )}`,
  },
  {
    name: 'description',
    label: 'Description',
    type: fieldTypes.text,
    hint: 'A sentence that describes the tag',
  },
  {
    name: 'icon',
    label: 'Icon',
    type: fieldTypes.dropdown,
    options: Object.keys(icons).map((importName) => ({
      label: importName,
      value: importName,
    })),
    hint: 'The name of an icon',
  },
  {
    name: 'isadult',
    label: 'Is adult',
    type: fieldTypes.checkbox,
    hint: 'Hide this tag if you do not have adult content enabled (NOT CURRENTLY IN USE)',
  },
  {
    name: 'oppositetag',
    label: 'Opposite Tag',
    type: fieldTypes.text,
    hint: 'Another tag (that does not have to exist) that is the "opposite" of this tag. eg. "rigged" has opposite "unrigged"',
  },
]

export default editableFields
