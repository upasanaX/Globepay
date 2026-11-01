import React from 'react';
import { styled, keyframes } from '../../stitches.config';
import { fadeInUp, scalePop as scalePopKf } from '../../styles/animations';

/* ─────────── keyframes ─────────── */

const shimmer = keyframes({
  '0%': { backgroundPosition: '-400px 0' },
  '100%': { backgroundPosition: '400px 0' },
});

const checkPop = keyframes({
  '0%': { transform: 'scale(0)', opacity: 0 },
  '60%': { transform: 'scale(1.2)', opacity: 1 },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

const shake = keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '10%, 50%, 90%': { transform: 'translateX(-3px)' },
  '30%, 70%': { transform: 'translateX(3px)' },
});

const selectPulse = keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
  '70%': { boxShadow: '0 0 0 8px rgba(16, 185, 129, 0)' },
  '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
});

/* ─────────── skeleton loader ─────────── */

const Skeleton = styled('div', {
  borderRadius: '$md',
  background: 'linear-gradient(90deg, $gray100 25%, $gray50 37%, $gray200 50%, $gray100 63%, $gray100 75%)',
  backgroundSize: '800px 100%',
  animation: `${shimmer} 1.8s ease-in-out infinite`,

  variants: {
    shape: {
      line: { height: '14px', width: '100%', borderRadius: '$full' },
      circle: { borderRadius: '$full' },
      card: {
        height: '100%',
        width: '100%',
        minHeight: '160px',
        borderRadius: '$lg',
      },
    },
  },

  defaultVariants: {
    shape: 'line',
  },
});

/* ─────────── checkout card ─────────── */

const CheckoutCardRoot = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  borderRadius: '$xl',
  border: '1.5px solid $border',
  backgroundColor: '$background',
  transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
  cursor: 'pointer',
  overflow: 'hidden',
  animation: `${fadeInUp} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,

  // focus
  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '3px',
  },

  // ── data-state selectors ──
  '&[data-state="idle"]': {
    borderColor: '$border',
  },
  '&[data-state="idle"]:hover': {
    borderColor: '$borderHover',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-2px)',
  },

  '&[data-state="valid"]': {
    borderColor: '$success',
    boxShadow: '0 0 0 3px $colors$successAlpha',
    animation: `${fadeInUp} 400ms cubic-bezier(0.16, 1, 0.3, 1) both, ${selectPulse} 600ms ease-out`,
  },
  '&[data-state="valid"] > svg, &[data-state="valid"] [data-icon="status"]': {
    color: '$success',
    animation: `${checkPop} 350ms cubic-bezier(0.34,1.56,0.64,1)`,
  },

  '&[data-state="invalid"]': {
    borderColor: '$error',
    boxShadow: '0 0 0 3px $colors$errorAlpha',
    animation: `${shake} 400ms ease-in-out`,
  },
  '&[data-state="invalid"] > svg, &[data-state="invalid"] [data-icon="status"]': {
    color: '$error',
  },

  // ── variants ──
  variants: {
    /** Visual state */
    state: {
      idle: {},
      valid: {},
      invalid: {},
      loading: {
        pointerEvents: 'none',
        opacity: 0.6,
      },
    },

    /** Compact (single-line) vs full (two-line) */
    size: {
      compact: {
        padding: '$3 $4',
        minHeight: '48px',

        '@bp1': {
          padding: '$3 $5',
        },
      },
      full: {
        padding: '$5',
        minHeight: '72px',
        flexDirection: 'row',
        flexWrap: 'wrap',

        '@bp1': {
          padding: '$6',
          minHeight: '80px',
        },
      },
    },
  },

  /* ── compound variants ── */
  compoundVariants: [
    // Valid + compact → subtle left accent
    {
      state: 'valid',
      size: 'compact',
      css: {
        borderLeftWidth: '3px',
        borderLeftColor: '$success',
        paddingLeft: 'calc($4 - 1.5px)',
      },
    },
    // Valid + full → green background tint
    {
      state: 'valid',
      size: 'full',
      css: {
        backgroundColor: '$successAlpha',
      },
    },
    // Invalid + compact → left accent red
    {
      state: 'invalid',
      size: 'compact',
      css: {
        borderLeftWidth: '3px',
        borderLeftColor: '$error',
        paddingLeft: 'calc($4 - 1.5px)',
      },
    },
    // Invalid + full → red background tint
    {
      state: 'invalid',
      size: 'full',
      css: {
        backgroundColor: '$errorAlpha',
      },
    },
    // Loading + full → taller skeleton area
    {
      state: 'loading',
      size: 'full',
      css: {
        minHeight: '96px',
      },
    },
  ],

  defaultVariants: {
    state: 'idle',
    size: 'full',
  },
});

/* ─── inner elements ─── */

const CardIcon = styled('div', {
  flexShrink: 0,
  size: '40px',
  borderRadius: '$lg',
  backgroundColor: '$gray100',
  flexCenter: 'row',
  color: '$textSecondary',
  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',

  [`${CheckoutCardRoot}:hover &`]: {
    backgroundColor: '$primaryAlpha',
    color: '$primary',
    transform: 'scale(1.05)',
  },

  variants: {
    size: {
      compact: { size: '34px', borderRadius: '$md' },
      full: { size: '40px' },
    },
  },

  defaultVariants: { size: 'full' },
});

const CardBody = styled('div', {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const CardTitle = styled('span', {
  fontWeight: '$semibold',
  color: '$text',
  truncate: true,

  variants: {
    size: {
      compact: { fontSize: '$sm' },
      full: { fontSize: '$base' },
    },
  },
  defaultVariants: { size: 'full' },
});

const CardDetail = styled('span', {
  fontSize: '$xs',
  color: '$textMuted',
  truncate: true,
});

const CardTrailing = styled('div', {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  color: '$textSecondary',
  transition: 'all 200ms ease',

  '& span': {
    fontWeight: 700,
    fontSize: '$sm',
    fontFamily: '$mono',
    letterSpacing: '-0.02em',
  },
});

const StatusIcon: React.FC<{ state: 'idle' | 'valid' | 'invalid' }> = ({ state }) => {
  if (state === 'valid') {
    return (
      <svg data-icon="status" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (state === 'invalid') {
    return (
      <svg data-icon="status" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  return null;
};

/* ─────────── TypeScript types ─────────── */

type CardState = 'idle' | 'valid' | 'invalid' | 'loading';
type CardSize = 'compact' | 'full';

export interface CheckoutCardProps {
  /** Card state controls styling + data-state attribute */
  state?: CardState;
  /** Compact single-line or full two-line layout */
  size?: CardSize;
  /** Primary label — e.g. "Visa •••• 4242" */
  title: string;
  /** Secondary detail — e.g. "Expires 09/27" */
  detail?: string;
  /** Trailing text — e.g. "$25.00" */
  trailing?: string;
  /** Icon slot (left side) */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
}

/* ─────────── component ─────────── */

export const CheckoutCard: React.FC<CheckoutCardProps> = ({
  state = 'idle',
  size = 'full',
  title,
  detail,
  trailing,
  icon,
  onClick,
}) => {
  /* loading skeleton */
  if (state === 'loading') {
    return (
      <CheckoutCardRoot state="loading" size={size} aria-busy="true">
        <Skeleton shape="circle" css={{ size: size === 'compact' ? '32px' : '40px' }} />
        <CardBody>
          <Skeleton css={{ width: '60%', height: size === 'compact' ? '12px' : '14px' }} />
          {size === 'full' && <Skeleton css={{ width: '40%', height: '10px', marginTop: '6px' }} />}
        </CardBody>
        <Skeleton css={{ width: '48px', height: '14px' }} />
      </CheckoutCardRoot>
    );
  }

  const dataState: string = state;

  return (
    <CheckoutCardRoot
      state={state}
      size={size}
      data-state={dataState}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Icon */}
      {icon && <CardIcon size={size}>{icon}</CardIcon>}

      {/* Body */}
      <CardBody>
        <CardTitle size={size}>{title}</CardTitle>
        {detail && size === 'full' && <CardDetail>{detail}</CardDetail>}
      </CardBody>

      {/* Trailing */}
      <CardTrailing>
        {trailing && <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{trailing}</span>}
        <StatusIcon state={state as 'idle' | 'valid' | 'invalid'} />
      </CardTrailing>
    </CheckoutCardRoot>
  );
};

/* ─────────── demo ─────────── */

const DemoGrid = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  maxWidth: '520px',
  mx: 'auto',
  padding: '$6',
});

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export const CheckoutCardDemo: React.FC = () => (
  <DemoGrid>
    <CheckoutCard state="loading" size="full" title="" />
    <CheckoutCard state="idle" size="full" title="Visa •••• 4242" detail="Expires 09/27" trailing="$25.00" icon={<CreditCardIcon />} />
    <CheckoutCard state="valid" size="full" title="Mastercard •••• 8888" detail="Expires 03/26" trailing="$50.00" icon={<CreditCardIcon />} />
    <CheckoutCard state="invalid" size="full" title="Amex •••• 1234" detail="Card expired" trailing="$12.00" icon={<CreditCardIcon />} />
    <CheckoutCard state="idle" size="compact" title="Visa •••• 4242" trailing="$25.00" icon={<CreditCardIcon />} />
    <CheckoutCard state="valid" size="compact" title="Mastercard •••• 8888" trailing="$50.00" icon={<CreditCardIcon />} />
    <CheckoutCard state="invalid" size="compact" title="Amex •••• 1234" trailing="$12.00" icon={<CreditCardIcon />} />
  </DemoGrid>
);

export default CheckoutCard;
