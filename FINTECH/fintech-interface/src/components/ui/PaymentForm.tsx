import React, { useState, useCallback, useMemo } from 'react';
import { styled, keyframes } from '../../stitches.config';
import { Button } from '../ui/Button';
import { fadeInUp, shimmer as shimmerKf } from '../../styles/animations';

/* ─────────────────── animations ─────────────────── */
const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const focusGlow = keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)' },
  '50%': { boxShadow: '0 0 0 6px rgba(139, 92, 246, 0.1)' },
  '100%': { boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)' },
});

const slideUp = keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

/* ─────────────────── styled primitives ─────────────────── */

const FormWrapper = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  padding: '$6',
  backgroundColor: '$background',
  borderRadius: '$xl',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  border: '1px solid $border',
  animation: `${fadeIn} 500ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  transition: 'box-shadow 300ms ease',

  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  },

  '@md': {
    padding: '$8',
    borderRadius: '$2xl',
  },
});

const FormTitle = styled('h2', {
  fontFamily: '$heading',
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$text',
  marginBottom: '$1',
  background: 'linear-gradient(135deg, $text 0%, $gray600 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',

  '@md': {
    fontSize: '$2xl',
  },
});

const FormSubtitle = styled('p', {
  fontSize: '$sm',
  color: '$textSecondary',
  marginBottom: '$2',
  animation: `${slideUp} 400ms 100ms cubic-bezier(0.16, 1, 0.3, 1) both`,
});

const FieldGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  animation: `${fadeInUp} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
});

const FieldRow = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',

  '@sm': {
    flexDirection: 'row',
    gap: '$4',
    '& > *': { flex: 1 },
  },
});

const Label = styled('label', {
  fontSize: '$sm',
  fontWeight: '$semibold',
  color: '$text',
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  letterSpacing: '-0.01em',
  marginBottom: '2px',
  transition: 'color 200ms ease',

  variants: {
    required: {
      true: {
        '&::after': {
          content: '"*"',
          color: '$error',
          marginLeft: '2px',
          fontSize: '$base',
          lineHeight: 1,
        },
      },
    },
  },
});

const HintText = styled('span', {
  fontSize: '$xs',
  color: '$textMuted',
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  animation: `${slideUp} 200ms ease-out both`,

  variants: {
    state: {
      error: {
        color: '$error',
        '&::before': {
          content: '"⚠"',
          fontSize: '10px',
        },
      },
      success: {
        color: '$success',
        '&::before': {
          content: '"✓"',
          fontSize: '10px',
          fontWeight: 'bold',
        },
      },
    },
  },
});

const Input = styled('input', {
  width: '100%',
  height: '46px',
  padding: '0 $4',
  fontFamily: '$body',
  fontSize: '$base',
  color: '$text',
  backgroundColor: '$surface',
  border: '1.5px solid $border',
  borderRadius: '$lg',
  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
  outline: 'none',

  '&::placeholder': {
    color: '$textMuted',
    transition: 'color 200ms ease',
  },

  '&:hover:not(:disabled)': {
    borderColor: '$borderHover',
    backgroundColor: '$background',
  },

  '&:focus': {
    borderColor: '$primary',
    boxShadow: '0 0 0 3px $colors$primaryAlpha',
    backgroundColor: '$background',
    animation: `${focusGlow} 500ms ease-out`,
    '&::placeholder': {
      color: '$gray300',
    },
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    state: {
      default: {},
      error: {
        borderColor: '$error',
        backgroundColor: 'rgba(239, 68, 68, 0.03)',
        '&:focus': {
          borderColor: '$error',
          boxShadow: '0 0 0 3px $colors$errorAlpha',
        },
      },
      success: {
        borderColor: '$success',
        backgroundColor: 'rgba(16, 185, 129, 0.03)',
        '&:focus': {
          borderColor: '$success',
          boxShadow: '0 0 0 3px $colors$successAlpha',
        },
      },
    },
  },

  defaultVariants: {
    state: 'default',
  },

  '@md': {
    height: '50px',
    padding: '0 $5',
  },
});

const CardIconRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  marginTop: '$1',

  '& svg': {
    width: '32px',
    height: '20px',
    opacity: 0.5,
  },
  '& svg.active': {
    opacity: 1,
  },
});

const Divider = styled('hr', {
  border: 'none',
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, $border 50%, transparent 100%)',
  margin: '$3 0',
});

const SecureNote = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  fontSize: '$xs',
  color: '$textMuted',
  marginTop: '$2',
  padding: '$2 $3',
  borderRadius: '$full',
  backgroundColor: '$surface',
  border: '1px solid $border',
  transition: 'all 200ms ease',

  '& svg': {
    width: '14px',
    height: '14px',
    color: '$success',
  },

  '&:hover': {
    borderColor: '$successAlpha',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
});

/* ─────────────────── helpers ─────────────────── */

/** Format card number with spaces every 4 digits */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/** Format expiry as MM/YY */
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/** Format CVV (3–4 digits) */
function formatCVV(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}

/* ─────────────────── component ─────────────────── */

interface PaymentFormProps {
  onSubmit?: (data: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    name: string;
  }) => void;
  loading?: boolean;
  amount?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  loading = false,
  amount,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ── validation ── */
  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, '');

    if (!digits) next.cardNumber = 'Card number is required';
    else if (digits.length < 16) next.cardNumber = 'Enter a valid 16-digit card number';

    if (!expiry) next.expiry = 'Expiry is required';
    else if (!/^\d{2}\/\d{2}$/.test(expiry)) next.expiry = 'Use MM/YY format';

    if (!cvv) next.cvv = 'CVV is required';
    else if (cvv.length < 3) next.cvv = 'Enter a valid CVV';

    if (!name.trim()) next.name = 'Cardholder name is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [cardNumber, expiry, cvv, name]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fieldState = (field: string): 'default' | 'error' | 'success' => {
    if (!touched[field]) return 'default';
    if (errors[field]) return 'error';
    return 'success';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ cardNumber: true, expiry: true, cvv: true, name: true });

    if (!validate()) return;

    onSubmit?.({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiry,
      cvv,
      name: name.trim(),
    });
  };

  /* ── render ── */
  return (
    <FormWrapper onSubmit={handleSubmit} noValidate>
      <div>
        <FormTitle>Payment Details</FormTitle>
        <FormSubtitle>
          {amount ? `Pay ${amount} securely` : 'Enter your card information'}
        </FormSubtitle>
      </div>

      {/* Card Number */}
      <FieldGroup>
        <Label htmlFor="cardNumber" required>
          Card Number
        </Label>
        <Input
          id="cardNumber"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          state={fieldState('cardNumber')}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          onBlur={() => { handleBlur('cardNumber'); validate(); }}
        />
        {touched.cardNumber && errors.cardNumber && (
          <HintText state="error">{errors.cardNumber}</HintText>
        )}
      </FieldGroup>

      {/* Expiry + CVV row */}
      <FieldRow>
        <FieldGroup>
          <Label htmlFor="expiry" required>
            Expiry Date
          </Label>
          <Input
            id="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            state={fieldState('expiry')}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            onBlur={() => { handleBlur('expiry'); validate(); }}
          />
          {touched.expiry && errors.expiry && (
            <HintText state="error">{errors.expiry}</HintText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="cvv" required>
            CVV
          </Label>
          <Input
            id="cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="•••"
            value={cvv}
            state={fieldState('cvv')}
            onChange={(e) => setCvv(formatCVV(e.target.value))}
            onBlur={() => { handleBlur('cvv'); validate(); }}
          />
          {touched.cvv && errors.cvv && (
            <HintText state="error">{errors.cvv}</HintText>
          )}
        </FieldGroup>
      </FieldRow>

      {/* Cardholder Name */}
      <FieldGroup>
        <Label htmlFor="name" required>
          Cardholder Name
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="cc-name"
          placeholder="John Doe"
          value={name}
          state={fieldState('name')}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => { handleBlur('name'); validate(); }}
        />
        {touched.name && errors.name && (
          <HintText state="error">{errors.name}</HintText>
        )}
      </FieldGroup>

      <Divider />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Processing payment…"
      >
        {amount ? `Pay ${amount}` : 'Pay Now'}
      </Button>

      <SecureNote>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured with 256-bit SSL encryption
      </SecureNote>
    </FormWrapper>
  );
};

export default PaymentForm;
