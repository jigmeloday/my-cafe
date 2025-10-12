import { DialogPropsType } from '../../../types';
import { Button } from './button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

function DialogComponent({ title, description, onConfirm, onCancel, btn1, btn2, isDisabled }: DialogPropsType) {
  return(
     <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className='my-[24px]'>
              {description}
            </DialogDescription>
            <div className='w-full flex justify-end space-x-2'>
              <Button disabled={isDisabled} onClick={() => onCancel()} variant="outline">{btn1}</Button>
              <Button disabled={isDisabled} onClick={() => onConfirm()}>{btn2}</Button>
              </div>
          </DialogHeader>
        </DialogContent>
  )
}

export default DialogComponent;