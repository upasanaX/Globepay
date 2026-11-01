import React, { useState } from 'react';
import { styled, keyframes } from '../../stitches.config';
import { Button } from '../ui/Button';
import { CheckoutCardDemo } from '../ui/CheckoutCard';
import { PaymentCardDemo } from '../ui/PaymentCard';
import { PaymentForm } from '../ui/PaymentForm';
import { globalStyles } from '../../styles/globalStyles';
import { fadeInUp, morphGradient } from '../../styles/animations';

/* ─────────── local keyframes ─────────── */

const headerSlide = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-12px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const underlineGrow = keyframes({
  '0%': { width: 0, opacity: 0 },
  '100%': { width: '48px', opacity: 1 },
});

/* ─────────── layout primitives ─────────── */

const Page = styled('div', {
  minHeight: '100vh',
  padding: '$6',
  fontFamily: '$body',
  background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 25%, #faf5ff 50%, #f0fdf4 75%, #f8f7ff 100%)',
  backgroundSize: '400% 400%',
  animation: `${morphGradient} 20s ease infinite`,

  '@bp1': { padding: '$8' },
  '@bp2': { padding: '$10 $16' },
});

const PageHeader = styled('header', {
  maxWidth: '960px',
  mx: 'auto',
  textAlign: 'center',
  marginBottom: '$12',
  animation: `${fadeInUp} 600ms cubic-bezier(0.16, 1, 0.3, 1) both`,
});

const PageTitle = styled('h1', {
  fontFamily: '$heading',
  fontSize: '$3xl',
  fontWeight: '$bold',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #10b981 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '$2',

  '@bp1': { fontSize: '$4xl' },
});

const PageSubtitle = styled('p', {
  fontSize: '$md',
  color: '$textSecondary',
  maxWidth: '500px',
  mx: 'auto',
  lineHeight: '$relaxed',
});

const Section = styled('section', {
  maxWidth: '960px',
  mx: 'auto',
  marginBottom: '$12',
  padding: '$6',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  borderRadius: '$2xl',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
  transition: 'box-shadow 300ms ease, transform 300ms ease',

  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  },

  '@bp1': { padding: '$8' },
});

const SectionTitle = styled('h2', {
  fontFamily: '$heading',
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$text',
  marginBottom: '$2',
  animation: `${headerSlide} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  letterSpacing: '-0.02em',
  position: 'relative',
  display: 'inline-block',

  // Animated underline accent
  '&::after': {
    content: '""',
    display: 'block',
    height: '3px',
    borderRadius: '$full',
    background: 'linear-gradient(90deg, $primary, $success)',
    marginTop: '$1',
    animation: `${underlineGrow} 500ms 200ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  },

  '@bp1': { fontSize: '$2xl' },
});

const SectionDesc = styled('p', {
  fontSize: '$sm',
  color: '$textSecondary',
  marginBottom: '$6',
  lineHeight: '$relaxed',
});

const Row = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '$3',
  marginBottom: '$4',
});

const Label = styled('span', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  minWidth: '80px',
});

const Divider = styled('hr', {
  border: 'none',
  height: '1px',
  background: 'linear-gradient(90deg, transparent, $border, transparent)',
  my: '$6',
});

const Badge = styled('span', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  px: '$2',
  py: '2px',
  borderRadius: '$full',
  backgroundColor: '$primaryAlpha',
  color: '$primary',
  border: '1px solid rgba(139, 92, 246, 0.15)',
});

/* ─────────── icon helpers ─────────── */

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

/* ─────────── demo page ─────────── */

const ButtonDemoPage: React.FC = () => {
  globalStyles();

  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Page>
      {/* ══════════ HEADER ══════════ */}
      <PageHeader>
        <PageTitle>Stitches Design System</PageTitle>
        <PageSubtitle>
          Interactive component library with animations, micro-interactions, and
          responsive design — built for fintech.
        </PageSubtitle>
      </PageHeader>

      {/* ══════════ BUTTONS ══════════ */}
      <Section>
        <SectionTitle>Button Variants</SectionTitle>
        <SectionDesc>
          Five variants — <Badge>primary</Badge> <Badge>success</Badge>{' '}
          <Badge>danger</Badge> <Badge>ghost</Badge> <Badge>outline</Badge> — with gradient backgrounds,
          click ripples, and elastic hover transitions.
        </SectionDesc>

        {/* Variants */}
        <Label>Variants</Label>
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
        </Row>

        {/* Sizes */}
        <Label>Small</Label>
        <Row>
          <Button variant="primary" size="sm">Primary sm</Button>
          <Button variant="success" size="sm">Success sm</Button>
          <Button variant="danger" size="sm">Danger sm</Button>
          <Button variant="ghost" size="sm">Ghost sm</Button>
          <Button variant="outline" size="sm">Outline sm</Button>
        </Row>

        <Label>Medium</Label>
        <Row>
          <Button variant="primary" size="md">Primary md</Button>
          <Button variant="success" size="md">Success md</Button>
          <Button variant="danger" size="md">Danger md</Button>
          <Button variant="ghost" size="md">Ghost md</Button>
          <Button variant="outline" size="md">Outline md</Button>
        </Row>

        <Label>Large</Label>
        <Row>
          <Button variant="primary" size="lg">Primary lg</Button>
          <Button variant="success" size="lg">Success lg</Button>
          <Button variant="danger" size="lg">Danger lg</Button>
          <Button variant="ghost" size="lg">Ghost lg</Button>
          <Button variant="outline" size="lg">Outline lg</Button>
        </Row>

        <Divider />

        {/* With Icons */}
        <Label>With Icons</Label>
        <Row>
          <Button variant="primary" leftIcon={<SendIcon />}>Send Money</Button>
          <Button variant="success" leftIcon={<PlusIcon />}>Add Card</Button>
          <Button variant="danger" leftIcon={<TrashIcon />}>Remove</Button>
          <Button variant="outline" rightIcon={<SendIcon />}>Details</Button>
        </Row>

        {/* Full Width */}
        <Label>Full Width</Label>
        <Row css={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: '400px' }}>
          <Button variant="primary" size="lg" fullWidth leftIcon={<SendIcon />}>Pay $25.00</Button>
          <Button variant="ghost" fullWidth>Cancel Transaction</Button>
        </Row>

        <Divider />

        {/* Loading */}
        <Label>Loading</Label>
        <Row>
          <Button variant="primary" loading loadingText="Sending…">Send Money</Button>
          <Button variant="success" loading size="sm">Processing</Button>
          <Button variant="danger" loading size="lg">Deleting</Button>
          <Button variant="ghost" loading>Loading</Button>
          <Button variant="outline" loading>Fetching</Button>
        </Row>

        {/* Interactive Loading */}
        <Label>Interactive</Label>
        <Row>
          <Button variant="primary" loading={loading} onClick={simulateLoading}>
            {loading ? 'Sending…' : 'Click to Send'}
          </Button>
          <Button variant="success" loading={loading} onClick={simulateLoading}>
            {loading ? 'Processing…' : 'Try Me Too'}
          </Button>
        </Row>

        <Divider />

        {/* Disabled */}
        <Label>Disabled</Label>
        <Row>
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="success" disabled>Success</Button>
          <Button variant="danger" disabled>Danger</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="outline" disabled>Outline</Button>
        </Row>
      </Section>

      {/* ══════════ CHECKOUT CARDS ══════════ */}
      <Section>
        <SectionTitle>Checkout Cards</SectionTitle>
        <SectionDesc>
          Compound variants with <Badge>state</Badge> × <Badge>size</Badge> —
          idle hover-lift, valid selection pulse, invalid shake, and loading skeleton with shimmer.
        </SectionDesc>
        <CheckoutCardDemo />
      </Section>

      {/* ══════════ PAYMENT CARDS ══════════ */}
      <Section>
        <SectionTitle>Payment Cards</SectionTitle>
        <SectionDesc>
          3D hover with shine sweep, holographic chip, gradient shadows —
          using <Badge>@bp1</Badge> / <Badge>@bp2</Badge> responsive breakpoints.
        </SectionDesc>
        <PaymentCardDemo />
      </Section>

      {/* ══════════ PAYMENT FORM ══════════ */}
      <Section>
        <SectionTitle>Payment Form</SectionTitle>
        <SectionDesc>
          Animated focus glow, validation states with entrance animations,
          auto-formatting inputs, and glassmorphism form container.
        </SectionDesc>
        <PaymentForm
          amount="$25.00"
          onSubmit={(data) => {
            alert(`✅ Payment submitted!\n${JSON.stringify(data, null, 2)}`);
          }}
        />
      </Section>
    </Page>
  );
};

export default ButtonDemoPage;
