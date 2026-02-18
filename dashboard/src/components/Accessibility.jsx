import React from 'react';

/**
 * Accessible Button Component
 * Includes proper ARIA labels, keyboard navigation, and focus management
 */
export function AccessibleButton({
  children,
  onClick,
  ariaLabel,
  disabled = false,
  variant = 'primary',
  className = ''
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const baseClasses = 'px-4 py-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-iridyne-green focus:ring-offset-2 focus:ring-offset-midnight-onyx';
  const variantClasses = {
    primary: 'bg-iridyne-green/20 hover:bg-iridyne-green/30 text-iridyne-green',
    secondary: 'bg-border-subtle/20 hover:bg-border-subtle/30 text-text-primary',
    danger: 'bg-volatility-orange/20 hover:bg-volatility-orange/30 text-volatility-orange'
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      tabIndex={0}
    >
      {children}
    </button>
  );
}

/**
 * Accessible Card Component
 * Includes proper semantic HTML and ARIA attributes
 */
export function AccessibleCard({
  children,
  title,
  ariaLabel,
  className = ''
}) {
  return (
    <section
      className={`bento-item ${className}`}
      aria-label={ariaLabel || title}
      role="region"
    >
      {title && (
        <h2 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-iridyne-green focus:text-midnight-onyx focus:rounded"
    >
      Skip to main content
    </a>
  );
}

/**
 * Accessible Status Indicator
 * Announces status changes to screen readers
 */
export function StatusIndicator({ status, message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message || `Status: ${status}`}
    </div>
  );
}

/**
 * Keyboard Navigation Helper
 * Provides visual feedback for keyboard focus
 */
export function useKeyboardNavigation() {
  React.useEffect(() => {
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('user-is-tabbing');
    };

    window.addEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleFirstTab);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
}

/**
 * Focus Trap for Modals
 * Keeps focus within a modal dialog
 */
export function useFocusTrap(ref, isActive) {
  React.useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        // Close modal logic here
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus first element
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, ref]);
}
