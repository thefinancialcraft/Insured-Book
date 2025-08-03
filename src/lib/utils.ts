import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to handle URL hash fragments on mobile devices
export function handleMobileHashFragment() {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile && window.location.hash) {
    // For mobile devices, we might need to handle hash fragments differently
    console.log("Mobile device detected with hash fragment:", window.location.hash);

    // Extract access token from hash if present
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      console.log("Access token found in hash fragment");
      // Store the token temporarily if needed
      sessionStorage.setItem('temp_access_token', accessToken);
    }

    // Clean up the URL hash to prevent issues
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', cleanUrl);
    }
  }
}

// Utility to check if we're in a mobile browser
export function isMobileBrowser() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Utility to add mobile-specific delays
export function getMobileDelay() {
  return isMobileBrowser() ? 1000 : 500;
}

// Debug utility for mobile authentication issues
export function debugMobileAuth() {
  const debugInfo = {
    userAgent: navigator.userAgent,
    isMobile: isMobileBrowser(),
    url: window.location.href,
    hash: window.location.hash,
    search: window.location.search,
    pathname: window.location.pathname,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    localStorage: {
      hasAuth: !!localStorage.getItem('sb-byljilpmoxrvorabcnn-auth-token'),
      hasSession: !!sessionStorage.getItem('temp_access_token')
    }
  };

  console.log("=== MOBILE AUTH DEBUG ===", debugInfo);
  return debugInfo;
}

// Utility to force refresh on mobile if needed
export function forceMobileRefresh() {
  if (isMobileBrowser()) {
    console.log("Forcing refresh on mobile device");
    window.location.reload();
  }
}
