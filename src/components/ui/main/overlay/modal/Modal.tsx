import { cn } from '@/lib/tailwind/tailwind-utils'
import { Dialog, Transition } from '@headlessui/react'
import { Button, ButtonProps } from '@ui/main/forms/button/Button'
import ShowOnly from '@ui/shared/show-only/ShowOnly'
import { cva, VariantProps } from 'class-variance-authority'
import React, { Fragment } from 'react'
import { v4 as uuid } from 'uuid'

const modalStyles = cva('', {
   variants: {
      size: {
         sm: "sm:max-w-md",
         md: "sm:max-w-lg",
         lg: "sm:max-w-xl",
         xl: "sm:max-w-2xl",
      },
   },
   defaultVariants: {
      size: "md",
   },
})

export interface ModalProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof modalStyles> {
   isOpen: boolean,
   onClose: () => void
   title?: string
   actions?: { action: 'custom' | 'close' | 'action', props?: ButtonProps, text?: string }[]
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
   
   const {
      children,
      className,
      isOpen,
      onClose,
      title,
      actions,
      size,
      ...rest
   } = props
   
   
   return (
      <>
         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>
               
               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <Dialog.Panel
                           className={cn(
                              "w-full transform overflow-hidden rounded-none sm:rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all",
                              modalStyles({ size }),
                           )}
                        >
                           {title && <Dialog.Title
                               as="h3"
                               className="text-lg font-medium leading-6 text-gray-900"
                           >
                              {title}
                           </Dialog.Title>}
                           <div className="mt-2">
                              {children}
                           </div>
                           
                           <ShowOnly when={actions && actions.length > 0}>
                              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                 {actions?.map(btn => {
                                    const _id = uuid()
                                    if (btn.action === 'close') {
                                       return <Button
                                          key={_id}
                                          intent="gray-outline"
                                          size="sm" {...btn.props}
                                          onClick={onClose}
                                       >Close</Button>
                                    }
                                    return <Button key={_id} {...btn.props}>{btn.text}</Button>
                                 })}
                                 {/*<Button intent="gray-outline" size="sm" onClick={onClose}>{t('form:cancel')}</Button>*/}
                                 {/*<Button*/}
                                 {/*   intent="alert" size="sm" onClick={() => {*/}
                                 {/*   onClose()*/}
                                 {/*   setBlockScreen(true)*/}
                                 {/*   onDelete && onDelete()*/}
                                 {/*}}*/}
                                 {/*>{t('form:delete')}</Button>*/}
                              </div>
                           </ShowOnly>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   )
   
})
