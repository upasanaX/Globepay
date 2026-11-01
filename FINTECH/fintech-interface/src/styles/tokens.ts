import { config, theme } from '../stitches.config';

/* ══════════════════════════════════════════════
   SMART TOKENS
   Type-safe scale references & semantic aliases
   that map back to the Stitches theme for
   auto-scaling across every component.
   ══════════════════════════════════════════════ */

/* ─────────── font-size scale ─────────── */
/*  token  │  rem     │  px                */
/*  $xs    │  0.75    │  12                */
/*  $sm    │  0.875   │  14                */
/*  $base  │  1       │  16                */
/*  $md    │  1.125   │  18                */
/*  $lg    │  1.25    │  20                */
/*  $xl    │  1.5     │  24                */
/*  $2xl   │  1.875   │  30                */
/*  $3xl   │  2.25    │  36                */
/*  $4xl   │  3       │  48                */

export const fontSize = {
  xs:   '$xs'   as const,  // 12px
  sm:   '$sm'   as const,  // 14px
  base: '$base' as const,  // 16px
  md:   '$md'   as const,  // 18px
  lg:   '$lg'   as const,  // 20px
  xl:   '$xl'   as const,  // 24px
  '2xl': '$2xl' as const,  // 30px
  '3xl': '$3xl' as const,  // 36px
  '4xl': '$4xl' as const,  // 48px
} as const;

/* ─────────── spacing scale (4px base) ─────────── */
/*  token  │  px                                     */
/*  $1     │  4                                      */
/*  $2     │  8                                      */
/*  $3     │  12                                     */
/*  $4     │  16                                     */
/*  $5     │  20                                     */
/*  $6     │  24                                     */
/*  $8     │  32                                     */
/*  $10    │  40                                     */
/*  $12    │  48                                     */
/*  $16    │  64                                     */
/*  $20    │  80                                     */
/*  $24    │  96                                     */

export const space = {
  px:  '1px'  as const,
  0:   '0'    as const,
  0.5: '2px'  as const,
  1:   '$1'   as const,  //  4px
  2:   '$2'   as const,  //  8px
  3:   '$3'   as const,  // 12px
  4:   '$4'   as const,  // 16px
  5:   '$5'   as const,  // 20px
  6:   '$6'   as const,  // 24px
  7:   '$7'   as const,  // 28px
  8:   '$8'   as const,  // 32px
  9:   '$9'   as const,  // 36px
  10:  '$10'  as const,  // 40px
  12:  '$12'  as const,  // 48px
  14:  '$14'  as const,  // 56px
  16:  '$16'  as const,  // 64px
  20:  '$20'  as const,  // 80px
  24:  '$24'  as const,  // 96px
} as const;

/* ─────────── radii scale ─────────── */
/*  token  │  px                        */
/*  $sm    │  4                         */
/*  $md    │  8                         */
/*  $lg    │  12                        */
/*  $xl    │  16                        */
/*  $2xl   │  24                        */
/*  $full  │  9999 (pill)               */

export const radii = {
  none: '0'     as const,
  sm:   '$sm'   as const,  //  4px
  md:   '$md'   as const,  //  8px – default
  lg:   '$lg'   as const,  // 12px
  xl:   '$xl'   as const,  // 16px
  '2xl': '$2xl' as const,  // 24px
  full: '$full' as const,  // pill
} as const;

/* ══════════════════════════════════════════════
   SEMANTIC ALIASES
   Map design-intent names → theme tokens so
   components describe *what* not *how much*.
   ══════════════════════════════════════════════ */

/** Typography presets — spread into `css` or `styled` */
export const typography = {
  /** Card title / section heading */
  heading: {
    fontFamily: '$heading',
    fontWeight: '$bold',
    fontSize: '$xl',       // 24px
    lineHeight: '$tight',
  },
  /** Sub-heading / form group label */
  subheading: {
    fontFamily: '$heading',
    fontWeight: '$semibold',
    fontSize: '$md',       // 18px
    lineHeight: '$tight',
  },
  /** Default body text */
  body: {
    fontFamily: '$body',
    fontWeight: '$normal',
    fontSize: '$base',     // 16px
    lineHeight: '$normal',
  },
  /** Secondary / helper text */
  caption: {
    fontFamily: '$body',
    fontWeight: '$normal',
    fontSize: '$sm',       // 14px
    lineHeight: '$normal',
    color: '$textSecondary',
  },
  /** Micro text (badges, tags) */
  micro: {
    fontFamily: '$body',
    fontWeight: '$medium',
    fontSize: '$xs',       // 12px
    lineHeight: '$tight',
  },
  /** Large display amount (₹12,500) */
  amount: {
    fontFamily: '$heading',
    fontWeight: '$bold',
    fontSize: '$3xl',      // 36px
    lineHeight: '$tight',
    letterSpacing: '-0.02em',
  },
  /** Mono for card / account numbers */
  mono: {
    fontFamily: '$mono',
    fontWeight: '$normal',
    fontSize: '$base',     // 16px
    letterSpacing: '0.05em',
  },
} as const;

/** Spacing presets — semantic distances */
export const gap = {
  /** Tight inline elements (icon + text) */
  inline:  '$2'  as const,  //  8px
  /** Between related fields */
  field:   '$4'  as const,  // 16px
  /** Between form sections */
  section: '$6'  as const,  // 24px
  /** Page-level padding */
  page:    '$8'  as const,  // 32px
  /** Card internal padding */
  card:    '$5'  as const,  // 20px
} as const;

/** Border-radius presets — semantic shapes */
export const shape = {
  /** Buttons, inputs */
  control: '$md'   as const,  //  8px
  /** Cards, panels */
  card:    '$lg'   as const,  // 12px
  /** Modals, sheets */
  modal:   '$xl'   as const,  // 16px
  /** Avatars, badges, pills */
  pill:    '$full' as const,  // 9999px
} as const;

/* ══════════════════════════════════════════════
   TYPE EXPORTS
   Pull real token keys from the Stitches config
   for type-safe usage in custom components.
   ══════════════════════════════════════════════ */

export type FontSizeToken  = keyof typeof config.theme.fontSizes;
export type SpaceToken     = keyof typeof config.theme.space;
export type RadiiToken     = keyof typeof config.theme.radii;
export type ColorToken     = keyof typeof config.theme.colors;
export type ShadowToken    = keyof typeof config.theme.shadows;
