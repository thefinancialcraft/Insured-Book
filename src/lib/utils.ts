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
    // For mobile devices, handle hash fragments more carefully
    console.log("Mobile device detected with hash fragment:", window.location.hash);

    try {
      // Extract all auth related params from hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const expiresIn = hashParams.get('expires_in');
      const provider = hashParams.get('provider');

      if (accessToken) {
        console.log("Access token found in hash fragment");
        // Store all auth related data
        sessionStorage.setItem('temp_access_token', accessToken);
        if (refreshToken) sessionStorage.setItem('temp_refresh_token', refreshToken);
        if (expiresIn) sessionStorage.setItem('temp_expires_in', expiresIn);
        if (provider) sessionStorage.setItem('temp_provider', provider);
        
        // Trigger a session refresh
        window.dispatchEvent(new Event('supabase.auth.token-refreshed'));
      }
    } catch (error) {
      console.error("Error handling mobile hash fragment:", error);
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
