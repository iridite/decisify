import { useState, useEffect } from 'react';

/**
 * Responsive Design Utilities
 * Tailwind breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
 */

// Breakpoint values
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Hook to detect current breakpoint
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('2xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setBreakpoint('xs');
      else if (width < breakpoints.md) setBreakpoint('sm');
      else if (width < breakpoints.lg) setBreakpoint('md');
      else if (width < breakpoints.xl) setBreakpoint('lg');
      else if (width < breakpoints['2xl']) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

// Hook to check if mobile
export function useIsMobile() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
}

// Hook to check if tablet
export function useIsTablet() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md' || breakpoint === 'lg';
}

// Hook to detect touch device
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}

// Hook for viewport dimensions
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

// Hook to detect orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
}

// Responsive grid columns helper
export function getResponsiveColumns(breakpoint) {
  const columns = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
    '2xl': 4
  };
  return columns[breakpoint] || 3;
}

// Responsive font size helper
export function getResponsiveFontSize(breakpoint, baseSize = 'base') {
  const sizes = {
    xs: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    },
    sm: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    },
    md: {
      xs: 'text-sm',
      sm: 'text-base',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    },
    lg: {
      xs: 'text-sm',
      sm: 'text-base',
      base: 'text-base',
      lg: 'text-xl',
      xl: 'text-2xl'
    },
    xl: {
      xs: 'text-sm',
      sm: 'text-base',
      base: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl'
    },
    '2xl': {
      xs: 'text-sm',
      sm: 'text-base',
      base: 'text-lg',
      lg: 'text-xl',
      xl: 'text-3xl'
    }
  };
  return sizes[breakpoint]?.[baseSize] || sizes.lg[baseSize];
}

// Responsive spacing helper
export function getResponsiveSpacing(breakpoint, type = 'padding') {
  const spacing = {
    xs: type === 'padding' ? 'p-3' : 'gap-3',
    sm: type === 'padding' ? 'p-4' : 'gap-4',
    md: type === 'padding' ? 'p-4' : 'gap-4',
    lg: type === 'padding' ? 'p-6' : 'gap-6',
    xl: type === 'padding' ? 'p-6' : 'gap-6',
    '2xl': type === 'padding' ? 'p-8' : 'gap-8'
  };
  return spacing[breakpoint] || spacing.lg;
}

// Mobile-optimized scroll behavior
export function useMobileScroll() {
  useEffect(() => {
    if ('ontouchstart' in window) {
      // Enable momentum scrolling on iOS
      document.body.style.webkitOverflowScrolling = 'touch';

      // Prevent pull-to-refresh on mobile
      let lastTouchY = 0;
      const preventPullToRefresh = (e) => {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;

        if (window.scrollY === 0 && touchYDelta > 0) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
      });
      document.addEventListener('touchmove', preventPullToRefresh, { passive: false });

      return () => {
        document.removeEventListener('touchmove', preventPullToRefresh);
      };
    }
  }, []);
}

// Detect if running as PWA
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    setIsPWA(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }, []);

  return isPWA;
}

// Safe area insets for notched devices
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    setInsets({
      top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
      right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
      left: parseInt(computedStyle.getPropertyValue('--sal') || '0')
    });
  }, []);

  return insets;
}
