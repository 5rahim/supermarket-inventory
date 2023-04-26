'use client'

import { useDisclosure } from '@/hooks/use-disclosure'
import { cn } from '@/lib/tailwind/tailwind-utils'
import { Dialog, Transition } from '@headlessui/react'
import { BiTrash } from '@react-icons/all-files/bi/BiTrash'
import { FiAlertTriangle } from '@react-icons/all-files/fi/FiAlertTriangle'
import { IconDisplay } from '@ui/main/data-display/icon-display/IconDisplay'
import { Button } from '@ui/main/forms/button/Button'
import { LayoutPaper } from '@ui/main/layout/paper/LayoutPaper'
import LoadingScreen from '@ui/shared/loading-spinner/LoadingScreen'
import React, { Fragment, useState } from 'react'

export interface DangerZoneProps extends React.ComponentPropsWithRef<'div'> {
   action: string
   onDelete?: () => void
}

export const DangerZone = React.forwardRef<HTMLDivElement, DangerZoneProps>((props, ref) => {
   
   const {
      children,
      action,
      onDelete,
      className,
      ...rest
   } = props
   
   const modal = useDisclosure(false)
   
   const [blockScreen, setBlockScreen] = useState<boolean>(false)
   
   return (
      <>
         <LoadingScreen show={blockScreen} />
         
         {/*<Divider />*/}
         
         <div
            className={cn(
               "",
               className,
            )}
            {...rest}
            ref={ref}
         >
            <LayoutPaper className="p-4 flex flex-col sm:flex-row gap-2 text-center sm:text-left border-red-400">
               <IconDisplay icon={<FiAlertTriangle />} intent="alert-basic" className="place-self-center sm:place-self-start" />
               <div>
                  <h2 className="text-lg text-red-500 font-semibold">Danger zone</h2>
                  <p className=""><span className="font-semibold">{action}</span>. This action is irreversible.</p>
                  <Button size="sm" intent="alert-subtle" className="mt-2" leftIcon={<BiTrash />} onClick={modal.open}>Delete</Button>
               </div>
            </LayoutPaper>
         </div>
         
         <Transition appear show={modal.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={modal.close}>
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
                        <Dialog.Panel className="w-full sm:max-w-lg transform overflow-hidden rounded-none sm:rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                           <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900"
                           >
                              Are you sure you want to delete this item?
                           </Dialog.Title>
                           <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                 This action is irreversible.
                              </p>
                           </div>
                           
                           <div className="mt-4 flex gap-2">
                              <Button intent="gray-outline" size="sm" onClick={modal.close}>Cancel</Button>
                              <Button
                                 intent="alert" size="sm" onClick={() => {
                                 modal.close()
                                 setBlockScreen(true)
                                 onDelete && onDelete()
                              }}
                              >Delete</Button>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   )
   
})
