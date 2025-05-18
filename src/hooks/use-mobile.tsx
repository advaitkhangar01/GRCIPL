
<<<<<<< HEAD
"use client" // Added "use client" for clarity, though useEffect already makes it client-side

=======
>>>>>>> 6b1a0c8 (Your commit message)
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
<<<<<<< HEAD
=======

>>>>>>> 6b1a0c8 (Your commit message)
  // Initialize with a default value (e.g., false) for SSR.
  // This ensures a consistent initial render on both server and client before hydration.
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // This effect runs only on the client side.
    if (typeof window === 'undefined') {
      // Should not happen in useEffect, but as a safeguard
      return;
    }

<<<<<<< HEAD
=======
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {

>>>>>>> 6b1a0c8 (Your commit message)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set the initial state correctly on the client after mount.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this runs once on mount (client-side)

<<<<<<< HEAD
  return isMobile
=======
  return isMobile // No need for `!!` as isMobile is now always boolean

    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile

>>>>>>> 6b1a0c8 (Your commit message)
}
