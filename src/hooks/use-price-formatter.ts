import { Nullish } from '@/types'
import Dinero, { Currency } from 'dinero.js'
import _ from 'lodash'

export const usePriceFormatter = () => {
   
   const locale = 'en'
   
   return {
      toFormat: (rawAmount: Nullish<number | string>, currency: Currency = "USD", precision: number = 2) => {
         if (rawAmount) {
            let amount: number = rawAmount as number
            if (_.isString(rawAmount)) amount = parseInt(rawAmount)
            return Dinero({ amount: amount, currency, precision }).setLocale(locale).toFormat()
         }
         
         return "0"
      },
   }
   
}
