import React from 'react';
import { styled, keyframes } from '../../stitches.config';
import { ripple as rippleKf } from '../../styles/animations';

/* ───── spinner animation ───── */
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

/* ───── ripple container ───── */
const RippleSpan = styled('span', {
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.35)',
  transform: 'scale(0)',
  animation: `${rippleKf} 600ms ease-out forwards`,
  pointerEvents: 'none',
});

/* ───── styled base ───── */
const StyledButton = styled('button', {
  // reset
  appearance: 'none',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',

  // layout
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  overflow: 'hidden',

  // typography
  fontFamily: '$body',
  fontWeight: '$semibold',
  lineHeight: '$tight',
  textDecoration: 'none',
  letterSpacing: '-0.01em',

  // shape
  borderRadius: '$md',
  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',

  // focus ring (color-matched in variants)
  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '3px',
  },

  // disabled
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    filter: 'grayscale(0.3)',
  },

  // icon sizing
  '& svg': {
    transition: 'transform 200ms ease',
  },

  '&:hover svg': {
    transform: 'scale(1.08)',
  },

  /* ── variants ── */
  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, $primary 0%, $primaryDark 100%)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
        '&:hover': {
          background: 'linear-gradient(135deg, $primaryLight 0%, $primary 100%)',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
          boxShadow: '0 1px 4px rgba(139, 92, 246, 0.3)',
        },
        '&:focus-visible': {
          outline: '2px solid $primaryLight',
          outlineOffset: '3px',
        },
      },

      success: {
        background: 'linear-gradient(135deg, $success 0%, $successDark 100%)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
        '&:hover': {
          background: 'linear-gradient(135deg, $successLight 0%, $success 100%)',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
          boxShadow: '0 1px 4px rgba(16, 185, 129, 0.3)',
        },
        '&:focus-visible': {
          outline: '2px solid $successLight',
          outlineOffset: '3px',
        },
      },

      danger: {
        background: 'linear-gradient(135deg, $error 0%, $errorDark 100%)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
        '&:hover': {
          background: 'linear-gradient(135deg, $errorLight 0%, $error 100%)',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
          boxShadow: '0 1px 4px rgba(239, 68, 68, 0.3)',
        },
        '&:focus-visible': {
          outline: '2px solid $errorLight',
          outlineOffset: '3px',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        color: '$text',
        border: '1.5px solid $border',
        backdropFilter: 'blur(4px)',
        '&:hover': {
          backgroundColor: '$gray100',
          borderColor: '$primary',
          color: '$primary',
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          backgroundColor: '$gray200',
          transform: 'translateY(0) scale(0.98)',
        },
        '&:focus-visible': {
          outline: '2px solid $primary',
          outlineOffset: '3px',
        },
      },

      outline: {
        backgroundColor: 'transparent',
        color: '$primary',
        border: '1.5px solid $primary',
        '&:hover': {
          backgroundColor: '$primaryAlpha',
          boxShadow: '0 2px 12px rgba(139, 92, 246, 0.2)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
        },
        '&:focus-visible': {
          outline: '2px solid $primaryLight',
          outlineOffset: '3px',
        },
      },
    },

    size: {
      sm: {
        fontSize: '$sm',
        height: '34px',
        px: '$3',
        borderRadius: '$md',
      },
      md: {
        fontSize: '$base',
        height: '42px',
        px: '$5',
      },
      lg: {
        fontSize: '$md',
        height: '50px',
        px: '$6',
        borderRadius: '$lg',
      },
    },

    fullWidth: {
      true: { width: '100%' },
    },

    loading: {
      true: {
        position: 'relative' as const,
        color: 'transparent !important',
        pointerEvents: 'none',

        '&::after': {
          content: '""',
          position: 'absolute',
          width: '1.1em',
          height: '1.1em',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '$full',
          animation: `${spin} 600ms linear infinite`,
        },
      },
    },
  },

  /* ── compound variants ── */
  compoundVariants: [
    // ghost loading spinner should be dark
    {
      variant: 'ghost',
      loading: true,
      css: {
        '&::after': {
          borderColor: 'rgba(0,0,0,0.15)',
          borderTopColor: '$text',
        },
      },
    },
    {
      variant: 'outline',
      loading: true,
      css: {
        '&::after': {
          borderColor: 'rgba(139,92,246,0.2)',
          borderTopColor: '$primary',
        },
      },
    },
  ],

  /* ── defaults ── */
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

/* ───── TypeScript props ───── */
type StyledButtonVariants = React.ComponentProps<typeof StyledButton>;

export interface ButtonProps extends StyledButtonVariants {
  /** Button label / children */
  children: React.ReactNode;
  /** Accessible label when loading */
  loadingText?: string;
  /** Icon placed before label */
  leftIcon?: React.ReactNode;
  /** Icon placed after label */
  rightIcon?: React.ReactNode;
  /** Enable click ripple effect */
  enableRipple?: boolean;
}

/* ───── component ───── */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, loadingText, leftIcon, rightIcon, enableRipple = true, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !loading) {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const id = Date.now();
        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
      }
      onClick?.(e);
    };

    return (
      <StyledButton
        ref={ref}
        loading={loading}
        aria-busy={Boolean(loading) || undefined}
        aria-label={loading && loadingText ? loadingText : undefined}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((r) => (
          <RippleSpan
            key={r.id}
            css={{
              left: r.x,
              top: r.y,
              width: '120px',
              height: '120px',
            }}
          />
        ))}
        {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
export default Button;
