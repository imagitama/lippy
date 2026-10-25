import React from 'react'
import Button from '@/components/button'
import { ColorEditableField } from '@/editable-fields'
import { GenericInputProps } from '../../types'
import ColorPickerButton from '@/components/color-picker-button'

export default ({
  onChange,
  value,
}: GenericInputProps<
  [number, number, number] | null,
  any,
  ColorEditableField<any>
>) => (
  <span>
    <ColorPickerButton
      value={value ? { r: value[0], g: value[1], b: value[2], a: 1 } : null}
      onChange={(newColor) =>
        onChange(newColor ? [newColor.r, newColor.g, newColor.b] : null)
      }
    />{' '}
    <Button size="small" color="secondary" onClick={() => onChange(null)}>
      Clear
    </Button>
  </span>
)
