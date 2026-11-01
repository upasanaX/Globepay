import { keyframes } from '../stitches.config';

/* ═══════════════════════════════════════════════
   🔄  CORE LOADING / FEEDBACK
   ═══════════════════════════════════════════════ */

/** Subtle scale throb for loading states */
export const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(0.95)', opacity: 0.85 },
});

/** Success confetti burst – rotate + rise */
export const successConfetti = keyframes({
  '0%': { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
  '50%': { transform: 'translateY(-20px) rotate(180deg) scale(1.15)', opacity: 0.8 },
  '100%': { transform: 'translateY(-40px) rotate(360deg) scale(0.6)', opacity: 0 },
});

/** Error shake – horizontal jiggle */
export const errorShake = keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '10%, 50%, 90%': { transform: 'translateX(-4px)' },
  '30%, 70%': { transform: 'translateX(4px)' },
});

/** Spinner rotation */
export const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

/* ═══════════════════════════════════════════════
   📥  ENTRANCE ANIMATIONS
   ═══════════════════════════════════════════════ */

/** Fade in + slide up */
export const fadeInUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(16px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

/** Fade out + slide down */
export const fadeOutDown = keyframes({
  '0%': { opacity: 1, transform: 'translateY(0)' },
  '100%': { opacity: 0, transform: 'translateY(12px)' },
});

/** Slide in from the left */
export const slideInLeft = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-24px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

/** Slide in from the right */
export const slideInRight = keyframes({
  '0%': { opacity: 0, transform: 'translateX(24px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

/** Slide down from the top */
export const slideInDown = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-16px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

/** Scale pop (elastic overshoot) */
export const scalePop = keyframes({
  '0%': { transform: 'scale(0)', opacity: 0 },
  '60%': { transform: 'scale(1.12)', opacity: 1 },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

/** Zoom-fade in */
export const zoomIn = keyframes({
  '0%': { transform: 'scale(0.92)', opacity: 0 },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

/* ═══════════════════════════════════════════════
   ✨  MICRO-INTERACTIONS
   ═══════════════════════════════════════════════ */

/** Soft floating hover — infinite bob */
export const float = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-6px)' },
});

/** Gentle breathing glow */
export const glow = keyframes({
  '0%, 100%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.25)' },
  '50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
});

/** Ripple ring expanding outward */
export const ripple = keyframes({
  '0%': { transform: 'scale(0)', opacity: 0.5 },
  '100%': { transform: 'scale(4)', opacity: 0 },
});

/** Horizontal shine/sweep across surface */
export const shineSweep = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' },
});

/** Shimmer gradient for skeletons */
export const shimmer = keyframes({
  '0%': { backgroundPosition: '-400px 0' },
  '100%': { backgroundPosition: '400px 0' },
});

/** Gradient morph – rotating hue for backgrounds */
export const morphGradient = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' },
});

/** Card flip on Y axis */
export const cardFlipIn = keyframes({
  '0%': { transform: 'perspective(800px) rotateY(-90deg)', opacity: 0 },
  '100%': { transform: 'perspective(800px) rotateY(0)', opacity: 1 },
});

/** Bounce in (elastic) */
export const bounceIn = keyframes({
  '0%': { transform: 'scale(0.3)', opacity: 0 },
  '50%': { transform: 'scale(1.08)' },
  '70%': { transform: 'scale(0.96)' },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

/** Subtle tilt shake for attention */
export const wiggle = keyframes({
  '0%, 100%': { transform: 'rotate(0deg)' },
  '25%': { transform: 'rotate(-3deg)' },
  '75%': { transform: 'rotate(3deg)' },
});

/** Slide up + fade for stagger lists */
export const staggerItem = keyframes({
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

/* ═══════════════════════════════════════════════
   🎛️  READY-MADE SHORTHAND STRINGS
   ═══════════════════════════════════════════════ */
export const animations = {
  // Core
  pulse: `${pulse} 1.8s ease-in-out infinite`,
  successConfetti: `${successConfetti} 800ms ease-out forwards`,
  errorShake: `${errorShake} 400ms ease-in-out`,
  spin: `${spin} 600ms linear infinite`,

  // Entrances
  fadeInUp: `${fadeInUp} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  fadeOutDown: `${fadeOutDown} 200ms ease-in forwards`,
  slideInLeft: `${slideInLeft} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  slideInRight: `${slideInRight} 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  slideInDown: `${slideInDown} 350ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  scalePop: `${scalePop} 400ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  zoomIn: `${zoomIn} 350ms cubic-bezier(0.16, 1, 0.3, 1) both`,
  bounceIn: `${bounceIn} 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
  cardFlipIn: `${cardFlipIn} 500ms cubic-bezier(0.16, 1, 0.3, 1) both`,

  // Micro-interactions
  float: `${float} 3s ease-in-out infinite`,
  glow: `${glow} 2s ease-in-out infinite`,
  ripple: `${ripple} 600ms ease-out forwards`,
  shineSweep: `${shineSweep} 1.5s ease-in-out`,
  shimmer: `${shimmer} 1.5s ease-in-out infinite`,
  morphGradient: `${morphGradient} 6s ease infinite`,
  wiggle: `${wiggle} 500ms ease-in-out`,

  // Stagger helper (use with custom delay)
  staggerItem: `${staggerItem} 500ms cubic-bezier(0.16, 1, 0.3, 1) both`,
} as const;

/** Helper: returns stagger-item animation with a computed delay */
export const staggerDelay = (index: number, baseMs = 60) =>
  `${staggerItem} 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * baseMs}ms both`;
