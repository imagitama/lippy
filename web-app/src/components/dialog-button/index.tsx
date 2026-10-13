import React, { useEffect, useState } from 'react'
import Button, { ButtonProps } from '../button'
import Dialog, { DialogProps } from '../dialog'

type Props = {
  dialog:
    | React.ReactElement<{ close?: () => void }>
    | ((args: { close: () => void }) => React.ReactNode)
  dialogProps?: DialogProps
} & ButtonProps

function renderDialog(dialog: Props['dialog'], close: () => void) {
  if (React.isValidElement(dialog)) {
    return React.cloneElement(dialog, { close })
  }
  // must call it as a function here to avoid re-mounting constantly (like with text inputs)
  return dialog({ close })
}

const DialogButton = (buttonProps: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {isOpen && (
        <Dialog
          onClose={() => setIsOpen(false)}
          {...(buttonProps.dialogProps || {})}>
          {renderDialog(buttonProps.dialog, () => setIsOpen(false))}
        </Dialog>
      )}
      <Button onClick={() => setIsOpen(!isOpen)} {...buttonProps} />
    </>
  )
}

export default DialogButton
