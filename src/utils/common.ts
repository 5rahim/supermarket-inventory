import * as R from 'ramda'

/**
 * @example
 * R.isEmpty([1, 2, 3]);           //=> false
 * R.isEmpty([]);                  //=> true
 * R.isEmpty('');                  //=> true
 * R.isEmpty({});                  //=> true
 * R.isEmpty({length: 0});         //=> false
 * R.isEmpty(Uint8Array.from([])); //=> true
 * R.isNil(null);                  //=> true
 * R.isNil(undefined);             //=> true
 * @param value
 * @returns {boolean}
 */
export const _isEmpty = (value: any) => R.isEmpty(value) || R.isNil(value)

export function _isObject(value: any): value is Record<string, any> {
   const type = typeof value
   return (
      value != null &&
      (type === "object" || type === "function") &&
      !Array.isArray(value)
   )
}
