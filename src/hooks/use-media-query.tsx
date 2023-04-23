import { useEffect, useLayoutEffect, useState } from "react"

export const useMediaQuery = (query: string) => {
   const [matches, setMatches] = useState(false)
   
   useEffect(() => {
      const media = window.matchMedia(query)
      if (media.matches !== matches) {
         setMatches(media.matches)
      }
      const listener = () => setMatches(media.matches)
      window.addEventListener("resize", listener)
      return () => window.removeEventListener("resize", listener)
   }, [matches, query])
   
   return matches
}

export const newBreakpoints = {
   mobile: 0,
   tablet: 640,
   desktop: 1024,
}

type BreakpointKeys = keyof typeof newBreakpoints;
type BreakpointValuesHelper = {
   [index in BreakpointKeys]?: string | number | boolean;
};

type BreakpointValues = BreakpointValuesHelper & {
   mobile: string | number | boolean;
};

type BetweenBreakpoint = {
   min: number;
   max: number;
};
export const above = (value: number): string =>
   `@media only screen and (min-width: ${value}px)`
export const below = (value: number): string =>
   `@media only screen and (max-width: ${value}px)`
export const between = ({ min, max }: BetweenBreakpoint): string =>
   `@media only screen and (min-width: ${min}px) and (max-width: ${max}px)`

const getBreakpointKeysBiggerThan = (key: keyof BreakpointValues) => {
   const breakpointSize = newBreakpoints[key]
   // if size is 0 then all breakpoint keys are bigger
   if (breakpointSize === 0) {
      return Object.keys(newBreakpoints)
   }
   
   const breakpointKeysToOverride = Object.keys(newBreakpoints)
                                          .map((breakpoint) => {
                                             // override bigger breakpoints
                                             if (
                                                newBreakpoints[breakpoint as keyof BreakpointValues] >= breakpointSize
                                             ) {
                                                return breakpoint
                                             }
                                             return undefined
                                          })
                                          .filter(Boolean)
   return breakpointKeysToOverride
}

export const useBreakpointValues = (breakpointValues: BreakpointValues) => {
   const overriddenBreakpoints: BreakpointValues = { ...newBreakpoints }
   
   Object.keys(breakpointValues).forEach((breakpointKey) => {
      const keysToOverride = getBreakpointKeysBiggerThan(
         breakpointKey as keyof BreakpointValues,
      )
      
      // @ts-ignore
      keysToOverride.forEach((overrideKey: keyof BreakpointValues) => {
         // @ts-ignore
         overriddenBreakpoints[overrideKey] = breakpointValues[breakpointKey]
      })
   })
   
   const [screenWidth, setScreenWidth] = useState<null | number>(null)
   const [value, setValue] = useState<
      null | number | string | boolean | undefined
   >(overriddenBreakpoints.mobile)
   
   useEffect(() => {
      setScreenWidth(window.innerWidth)
      const updateScreenWidth = () => {
         setScreenWidth(window.innerWidth)
      }
      
      window.addEventListener("resize", updateScreenWidth)
      
      return () => window.removeEventListener("resize", updateScreenWidth)
   }, [breakpointValues])
   
   // eslint-disable-next-line consistent-return
   useLayoutEffect(() => {
      if (screenWidth) {
         const ascendingBreakpoints = Object.values(newBreakpoints).sort(
            (a, b) => a - b,
         )
         const breakpointsSmallerThenScreenWidth = ascendingBreakpoints.filter(
            (breakpoint) => breakpoint <= screenWidth,
         )
         
         const closestBreakpoint = breakpointsSmallerThenScreenWidth.pop()
         
         const currentMatchingBreakpointKey = Object.keys(
            overriddenBreakpoints,
         ).find(
            (breakpoint) =>
               newBreakpoints[breakpoint as keyof BreakpointValues] ===
               closestBreakpoint,
         )
         
         if (currentMatchingBreakpointKey) {
            setValue(
               overriddenBreakpoints[
                  currentMatchingBreakpointKey as keyof BreakpointValues
                  ],
            )
         }
      }
   }, [screenWidth, breakpointValues])
   
   return value
}


export const useResponsiveValues = () => {

}
