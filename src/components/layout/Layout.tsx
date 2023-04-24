import { cn } from '@/lib/tailwind/tailwind-utils'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BiMenu } from '@react-icons/all-files/bi/BiMenu'
import { BiX } from '@react-icons/all-files/bi/BiX'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { Fragment } from 'react'


interface LayoutProps {
   children?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = (props) => {
   
   const { children, ...rest } = props
   
   const { data: session } = useSession()
   
   const user = {
      name: session?.user?.name,
      email: session?.user?.email,
      imageUrl: session?.user?.image
   }
   
   const navigation = [
      { name: 'My supermarket', href: '/supermarket', current: false },
      { name: 'Inventory', href: '/supermarket/inventory', current: false },
   ]
   const userNavigation = [
      { name: 'Sign out', href: '/api/auth/signout' },
   ]
   
   return (
      <>
         <div className="min-h-full">
            <Disclosure as="nav" className="bg-indigo-600">
               {({ open }) => (
                  <>
                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <Link href="/">
                                    <p className="text-white">Supermarket Inventory</p>
                                 </Link>
                              </div>
                              <div className="hidden md:block">
                                 <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => (
                                       <a
                                          key={item.name}
                                          href={item.href}
                                          className={cn(
                                             item.current
                                                ? 'bg-indigo-700 text-white'
                                                : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                             'px-3 py-2 rounded-md text-sm font-medium',
                                          )}
                                          aria-current={item.current ? 'page' : undefined}
                                       >
                                          {item.name}
                                       </a>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="hidden md:block">
                              <div className="ml-4 flex items-center md:ml-6">
                                 
                                 {/* Profile dropdown */}
                                 <Menu as="div" className="relative ml-3">
                                    <div>
                                       <Menu.Button className="flex max-w-xs items-center rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                                          <span className="sr-only">Open user menu</span>
                                          {user.imageUrl && <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />}
                                       </Menu.Button>
                                    </div>
                                    <Transition
                                       as={Fragment}
                                       enter="transition ease-out duration-100"
                                       enterFrom="transform opacity-0 scale-95"
                                       enterTo="transform opacity-100 scale-100"
                                       leave="transition ease-in duration-75"
                                       leaveFrom="transform opacity-100 scale-100"
                                       leaveTo="transform opacity-0 scale-95"
                                    >
                                       <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                          {userNavigation.map((item) => (
                                             <Menu.Item key={item.name}>
                                                {({ active }) => (
                                                   <a
                                                      href={item.href}
                                                      className={cn(
                                                         active ? 'bg-gray-100' : '',
                                                         'block px-4 py-2 text-sm text-gray-700',
                                                      )}
                                                   >
                                                      {item.name}
                                                   </a>
                                                )}
                                             </Menu.Item>
                                          ))}
                                       </Menu.Items>
                                    </Transition>
                                 </Menu>
                              </div>
                           </div>
                           <div className="-mr-2 flex md:hidden">
                              {/* Mobile menu button */}
                              <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                                 <span className="sr-only">Open main menu</span>
                                 {open ? (
                                    <BiX className="block h-6 w-6" aria-hidden="true" />
                                 ) : (
                                    <BiMenu className="block h-6 w-6" aria-hidden="true" />
                                 )}
                              </Disclosure.Button>
                           </div>
                        </div>
                     </div>
                     
                     <Disclosure.Panel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                           {navigation.map((item) => (
                              <Disclosure.Button
                                 key={item.name}
                                 as="a"
                                 href={item.href}
                                 className={cn(
                                    item.current
                                       ? 'bg-indigo-700 text-white'
                                       : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                    'block px-3 py-2 rounded-md text-base font-medium',
                                 )}
                                 aria-current={item.current ? 'page' : undefined}
                              >
                                 {item.name}
                              </Disclosure.Button>
                           ))}
                        </div>
                        <div className="border-t border-indigo-700 pt-4 pb-3">
                           <div className="flex items-center px-5">
                              <div className="flex-shrink-0">
                                 {user.imageUrl && <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />}
                              </div>
                              <div className="ml-3">
                                 <div className="text-base font-medium text-white">{user.name}</div>
                                 <div className="text-sm font-medium text-indigo-300">{user.email}</div>
                              </div>
                           </div>
                           <div className="mt-3 space-y-1 px-2">
                              {userNavigation.map((item) => (
                                 <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                                 >
                                    {item.name}
                                 </Disclosure.Button>
                              ))}
                           </div>
                        </div>
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
            
            <header className="bg-white shadow">
               <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
               </div>
            </header>
            <main>
               <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                  {/* Replace with your content */}
                  <div className="p-4 rounded-lg border-4 border border-gray-200">
                     <div className="">
                        {children}
                     </div>
                  </div>
                  {/* /End replace */}
               </div>
            </main>
         </div>
      </>
   )
   
}
