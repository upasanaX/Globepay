import React from 'react';
import { styled, keyframes } from '../../stitches.config';

/* ─────────────────── local keyframes ─────────────────── */

const holographicShine = keyframes({
  '0%': { backgroundPosition: '200% 50%' },
  '100%': { backgroundPosition: '-200% 50%' },
});

const cardEntrance = keyframes({
  '0%': { opacity: 0, transform: 'perspective(800px) rotateY(-8deg) translateY(16px)' },
  '100%': { opacity: 1, transform: 'perspective(800px) rotateY(0) translateY(0)' },
});

/* ─────────────────── layout grid ─────────────────── */

/** Responsive grid that stacks on mobile, 2-col on tablet, 3-col on desktop */
export const CardGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$5',
  width: '100%',

  '@bp1': {
    gridCols: 2,
    gap: '$5',
  },
  '@bp2': {
    gridCols: 3,
    gap: '$6',
  },
});

/* ─────────────────── payment card ─────────────────── */

const CardOuter = styled('div', {
  position: 'relative',
  borderRadius: '$xl',
  overflow: 'hidden',
  transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  cursor: 'pointer',
  animation: `${cardEntrance} 600ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  transformStyle: 'preserve-3d',
  willChange: 'transform',

  // Shine sweep overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
    transform: 'translateX(-100%)',
    transition: 'transform 600ms ease',
    zIndex: 2,
    pointerEvents: 'none',
  },

  // Glassmorphism border
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '$xl',
    border: '1px solid rgba(255,255,255,0.2)',
    pointerEvents: 'none',
    zIndex: 3,
  },

  '&:hover': {
    transform: 'translateY(-4px) scale(1.015)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.1)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },

  '&:active': {
    transform: 'translateY(-2px) scale(1.005)',
    transition: 'all 100ms ease',
  },

  variants: {
    color: {
      purple: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 40%, #4c1d95 100%)',
        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.35), 0 0 60px rgba(139, 92, 246, 0.15)',
        },
      },
      green: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 40%, #047857 100%)',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.35), 0 0 60px rgba(16, 185, 129, 0.15)',
        },
      },
      dark: {
        background: 'linear-gradient(135deg, #374151 0%, #1f2937 40%, #111827 100%)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },

  defaultVariants: {
    color: 'purple',
  },
});

const CardInner = styled('div', {
  position: 'relative',
  padding: '$5',
  color: '#fff',
  minHeight: '190px',
  flexCenter: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  zIndex: 1,

  '@bp1': {
    padding: '$6',
    minHeight: '210px',
  },
});

const CardRow = styled('div', {
  flexBetween: 'row',
  width: '100%',
});

const CardLabel = styled('span', {
  fontSize: '$xs',
  fontWeight: '$medium',
  opacity: 0.75,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

const CardNumber = styled('p', {
  fontFamily: '$mono',
  fontSize: '$md',
  fontWeight: '$semibold',
  letterSpacing: '0.18em',
  my: '$3',
  textShadow: '0 1px 2px rgba(0,0,0,0.2)',

  '@bp1': {
    fontSize: '$lg',
  },
});

const CardName = styled('p', {
  fontSize: '$sm',
  fontWeight: '$medium',
  truncate: true,
  maxWidth: '60%',
});

const CardExpiry = styled('p', {
  fontFamily: '$mono',
  fontSize: '$sm',
  textAlign: 'right',
});

const CardChip = styled('div', {
  size: '40px',
  borderRadius: '$md',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0.5) 100%)',
  backgroundSize: '300% 100%',
  border: '1px solid rgba(255,255,255,0.35)',
  animation: `${holographicShine} 3s ease-in-out infinite`,
  position: 'relative',
  overflow: 'hidden',

  // Inner lines mimicking chip pattern
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '25%',
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.3)',
  },

  '@bp1': {
    size: '46px',
  },
});

const CardBrand = styled('span', {
  fontSize: '$lg',
  fontWeight: '$bold',
  letterSpacing: '-0.02em',
  textShadow: '0 1px 3px rgba(0,0,0,0.2)',

  '@bp1': {
    fontSize: '$xl',
  },
});

const Contactless = styled('div', {
  posAbsolute: 'auto',
  top: '$5',
  right: '$5',
  bottom: 'auto',
  left: 'auto',
  size: '26px',
  opacity: 0.7,
  transition: 'opacity 200ms ease',
  zIndex: 1,

  [`${CardOuter}:hover &`]: {
    opacity: 1,
  },
});

/* ─────────────────── component ─────────────────── */

interface PaymentCardProps {
  /** Last 4 digits (rest masked) */
  last4: string;
  /** Cardholder name */
  name: string;
  /** MM/YY */
  expiry: string;
  /** Card brand label */
  brand?: string;
  /** Gradient color */
  color?: 'purple' | 'green' | 'dark';
  onClick?: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  last4,
  name,
  expiry,
  brand = 'VISA',
  color = 'purple',
  onClick,
}) => {
  const masked = `•••• •••• •••• ${last4}`;

  return (
    <CardOuter color={color} onClick={onClick} role="button" tabIndex={0}>
      <Contactless>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M6 13.5a9 9 0 0 1 12 0" />
          <path d="M3.5 10.5a13 13 0 0 1 17 0" />
        </svg>
      </Contactless>

      <CardInner>
        {/* Top: chip + brand */}
        <CardRow>
          <CardChip />
          <CardBrand>{brand}</CardBrand>
        </CardRow>

        {/* Number */}
        <CardNumber>{masked}</CardNumber>

        {/* Bottom: name + expiry */}
        <CardRow>
          <div>
            <CardLabel>Card Holder</CardLabel>
            <CardName>{name}</CardName>
          </div>
          <div style={{ textAlign: 'right' }}>
            <CardLabel>Expires</CardLabel>
            <CardExpiry>{expiry}</CardExpiry>
          </div>
        </CardRow>
      </CardInner>
    </CardOuter>
  );
};

/* ─────────────────── demo layout ─────────────────── */

/** Quick preview wrapper — shows 3 cards in a responsive grid */
export const PaymentCardDemo: React.FC = () => (
  <CardGrid>
    <PaymentCard last4="4242" name="Alex Johnson"  expiry="09/27" brand="VISA"       color="purple" />
    <PaymentCard last4="8888" name="Alex Johnson"  expiry="03/26" brand="Mastercard" color="green"  />
    <PaymentCard last4="1234" name="Alex Johnson"  expiry="12/28" brand="Amex"       color="dark"   />
  </CardGrid>
);

export default PaymentCard;
