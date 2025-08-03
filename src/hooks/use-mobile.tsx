import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Additional mobile utilities
export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    // Check if it's a mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
    }

    // Check if it's a touch device
    const checkTouchDevice = () => {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsTouchDevice(touch)
    }

    checkMobile()
    checkTouchDevice()

    // Add viewport meta tag for mobile if not present
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      document.head.appendChild(meta)
    }

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile, isTouchDevice }
}
