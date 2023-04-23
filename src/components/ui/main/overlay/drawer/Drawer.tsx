import { cn } from '@/lib/tailwind/tailwind-utils'
import { Dialog, Transition } from '@headlessui/react'
import { BiX } from '@react-icons/all-files/bi/BiX'
import { IconButton } from '@ui/main/forms/button/IconButton'
import { cva, VariantProps } from 'class-variance-authority'
import React, { Fragment } from 'react'


const panelStyles = cva(null, {
   variants: {
      size: {
         md: "max-w-md",
         lg: "max-w-2xl",
         xl: "max-w-5xl",
         full: "max-w-full",
      },
      placement: {
         top: "",
         right: "",
         left: "",
         bottom: "",
      },
   },
   defaultVariants: {
      size: "md",
      placement: "right",
   },
})


export interface DrawerProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof panelStyles> {
   isOpen: boolean
   withCloseButton?: boolean
   onClose: () => void
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
   
   const {
      children,
      className,
      size = "md",
      placement = "right",
      withCloseButton = false,
      isOpen,
      onClose,
      ...rest
   } = props
   
   let animation = {
      enter: "transform transition ease-in-out duration-500 sm:duration-500",
      enterFrom: "translate-x-full",
      enterTo: "translate-x-0",
      leave: "transform transition ease-in-out duration-500 sm:duration-500",
      leaveFrom: "translate-x-0",
      leaveTo: "translate-x-full",
   }
   
   if (placement == "bottom") {
      animation = {
         ...animation,
         enterFrom: "translate-y-full",
         enterTo: "translate-y-0",
         leaveFrom: "translate-y-0",
         leaveTo: "translate-y-full",
      }
   } else if (placement == "top") {
      animation = {
         ...animation,
         enterFrom: "-translate-y-full",
         enterTo: "translate-y-0",
         leaveFrom: "translate-y-0",
         leaveTo: "-translate-y-full",
      }
   } else if (placement == 'left') {
      animation = {
         ...animation,
         enterFrom: "-translate-x-full",
         enterTo: "translate-x-0",
         leaveFrom: "translate-x-0",
         leaveTo: "-translate-x-full",
      }
   }
   
   return (
      <>
         <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
               as="div"
               className={cn(
                  "relative z-50",
                  // elementStyles({ }),
                  className,
               )}
               onClose={onClose}
               {...rest}
               ref={ref}
            >
               
               {/*Overlay*/}
               <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
               </Transition.Child>
               
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div
                        className={cn(
                           "pointer-events-none fixed flex",
                           {
                              "inset-y-0 max-w-full": (placement == 'right' || placement == 'left'),
                              "inset-x-0": (placement == 'top' || placement == 'bottom'),
                              //
                              "pl-0": placement == 'right',
                              //
                              "right-0": placement == "right",
                              "left-0": placement == "left",
                              "top-0": placement == "top",
                              "bottom-0": placement == "bottom",
                           },
                        )}
                     >
                        <Transition.Child
                           as={Fragment}
                           {...animation}
                        >
                           <Dialog.Panel
                              className={cn(
                                 "pointer-events-auto relative",
                                 {
                                    "w-screen": (placement == 'right' || placement == 'left' || placement == 'top' || placement == 'bottom'),
                                    // "w-screen": (),
                                    // Right or Left
                                    "max-w-md": size == 'md' && (placement == 'right' || placement == 'left'),
                                    "max-w-2xl": size == 'lg' && (placement == 'right' || placement == 'left'),
                                    "max-w-5xl": size == 'xl' && (placement == 'right' || placement == 'left'),
                                    "max-w-full": size == 'full' && (placement == 'right' || placement == 'left'),
                                    // Top or Bottom
                                    // "max-h-80": size == 'md' && (placement == 'bottom' || placement == 'top'),
                                    // "max-h-2xl": size == 'lg' && (placement == 'bottom' || placement == 'top'),
                                    // "max-h-5xl": size == 'xl' && (placement == 'bottom' || placement == 'top'),
                                    "min-h-screen": size == 'full' && (placement == 'bottom' || placement == 'top'),
                                 },
                                 // panelStyles({ size })
                              )}
                           >
                              {/*{withCloseButton && <Transition.Child*/}
                              {/*   as={Fragment}*/}
                              {/*   enter="ease-in-out duration-500"*/}
                              {/*   enterFrom="opacity-0"*/}
                              {/*   enterTo="opacity-100"*/}
                              {/*   leave="ease-in-out duration-500"*/}
                              {/*   leaveFrom="opacity-100"*/}
                              {/*   leaveTo="opacity-0"*/}
                              {/*>*/}
                              {/*   <div*/}
                              {/*      className={cn(*/}
                              {/*         "absolute top-0 flex",*/}
                              {/*         {*/}
                              {/*            "left-0 pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4": placement == 'right',*/}
                              {/*            "right-0 pt-4 pl-2 -mr-8 sm:-mr-10 sm:pl-4": placement == 'left',*/}
                              {/*            "hidden": placement == 'top' || placement == 'bottom',*/}
                              {/*         },*/}
                              {/*      )}*/}
                              {/*   >*/}
                              {/*      <button*/}
                              {/*         type="button"*/}
                              {/*         className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white text-3xl"*/}
                              {/*         onClick={() => onClose()}*/}
                              {/*      >*/}
                              {/*         <span className="sr-only">Close panel</span>*/}
                              {/*         <BiX />*/}
                              {/*      </button>*/}
                              {/*   </div>*/}
                              {/*</Transition.Child>}*/}
                              
                              {/*Body*/}
                              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                                 <div
                                    className={cn(
                                       "flex w-full justify-between p-4 pb-0",
                                    )}
                                 >
                                    <div className="">
                                       {/* TODO: Drawer title */}
                                       {/*<Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>*/}
                                    </div>
                                    {withCloseButton &&
                                        <IconButton
                                            type="button"
                                            className="rounded-full"
                                            intent="gray-outline"
                                            onClick={() => onClose()}
                                            icon={<BiX />}
                                        />}
                                 </div>
                                 <div className="relative flex-1 p-4 sm:p-6">
                                    {/* Replace with your content */}
                                    {children}
                                    {/*<div className="absolute inset-0 px-4 sm:px-6">*/}
                                    {/*   <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" />*/}
                                    {/*</div>*/}
                                    {/* /End replace */}
                                 </div>
                              </div>
                           </Dialog.Panel>
                        
                        </Transition.Child>
                     </div>
                  </div>
               </div>
            </Dialog>
         </Transition.Root>
      </>
   )
   
})
