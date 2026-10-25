import React, { useState } from 'react'
import { rgbaToHsva } from '@uiw/color-convert'
import ColorLensIcon from '@mui/icons-material/ColorLens'

import Dialog from '../dialog'
import Heading from '../heading'
import Button, { ButtonProps } from '../button'

const Sketch = React.lazy(() => import('@uiw/react-color-sketch'))

export interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

export type Color = RgbaColor

export const PURE_BLACK: RgbaColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,
}
export const PURE_WHITE: RgbaColor = {
  r: 255,
  g: 255,
  b: 255,
  a: 1,
}

const ColorPickerButton = ({
  value,
  onChange,
  ...buttonProps
}: {
  value: Color | null
  onChange: (newColorRgba: Color | null) => void
} & ButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClickDone = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <Dialog onClose={onClickDone}>
          <Heading variant="h1">Color Picker</Heading>
          <p>Pick a color:</p>
          <Sketch
            color={value ? rgbaToHsva(value) : undefined}
            onChange={(color) => onChange(color.rgba)}
          />
          {value && (
            <p>
              You have chosen:{' '}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: `rgba(${value.r},${value.g},${value.b},${value.a})`,
                }}></div>
            </p>
          )}
          <Button onClick={onClickDone}>Done</Button>
        </Dialog>
      )}
      <Button
        icon={<ColorLensIcon />}
        color="secondary"
        onClick={() => setIsOpen(true)}
        {...buttonProps}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          Color
          {value && (
            <div
              style={{
                width: '10px',
                height: '10px',
                marginLeft: '0.25rem',
                backgroundColor: `rgba(${value.r},${value.g},${value.b},${value.a})`,
              }}></div>
          )}
        </span>
      </Button>
    </>
  )
}

export default ColorPickerButton
