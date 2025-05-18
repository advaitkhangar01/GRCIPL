<<<<<<< HEAD

=======
>>>>>>> 573bb45a (Initial project push)
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
<<<<<<< HEAD
  // Initialize with a default value (e.g., false) for SSR.
  // This ensures a consistent initial render on both server and client before hydration.
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // This effect runs only on the client side.
    if (typeof window === 'undefined') {
      // Should not happen in useEffect, but as a safeguard
      return;
    }

=======
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
>>>>>>> 573bb45a (Initial project push)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
<<<<<<< HEAD

    // Set the initial state correctly on the client.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this runs once on mount (client-side)

  return isMobile // No need for `!!` as isMobile is now always boolean
=======
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
>>>>>>> 573bb45a (Initial project push)
}
