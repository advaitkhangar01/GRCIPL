
"use client" // Added "use client" for clarity, though useEffect already makes it client-side

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a default value (e.g., false) for SSR.
  // This ensures a consistent initial render on both server and client before hydration.
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // This effect runs only on the client side.
    if (typeof window === 'undefined') {
      // Should not happen in useEffect, but as a safeguard
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set the initial state correctly on the client after mount.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this runs once on mount (client-side)

  return isMobile
}
