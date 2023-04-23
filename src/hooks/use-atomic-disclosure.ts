import { atom, PrimitiveAtom, useAtom } from 'jotai'
import { withImmer } from 'jotai-immer'

type DisclosureAtomType = { isOpen: boolean }

export const disclosureAtom = () => withImmer(atom<DisclosureAtomType>(
   { isOpen: false }))

/**
 * Used to persist the open state of a drawer
 * @param atom
 */
export const useAtomicDisclosure = (atom: PrimitiveAtom<DisclosureAtomType>) => {
   
   const [disclosure, setDisclosure] = useAtom(atom)
   
   return {
      isOpen: disclosure.isOpen,
      onOpen: () => setDisclosure(d => ({ ...d, isOpen: true })),
      onClose: () => setDisclosure(d => ({ ...d, isOpen: false })),
      onToggle: () => setDisclosure(d => ({ ...d, isOpen: !d.isOpen })),
   }
   
}
