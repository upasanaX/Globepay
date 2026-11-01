import { globalCss } from '../stitches.config';

export const globalStyles = globalCss({
  /* ── reset ── */
  '*, *::before, *::after': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  /* ── html ── */
  html: {
    scrollBehavior: 'smooth',
    textSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  /* ── body ── */
  body: {
    margin: 0,
    padding: 0,
    fontFamily: '$body',
    fontSize: '$base',
    lineHeight: '$normal',
    color: '$text',
    backgroundColor: '$background',
    minHeight: '100vh',
    overflowX: 'hidden',
  },

  /* ── typography reset ── */
  'h1, h2, h3, h4, h5, h6': {
    fontFamily: '$heading',
    fontWeight: '$bold',
    lineHeight: '$tight',
  },

  'p, span, label': {
    lineHeight: '$normal',
  },

  /* ── links ── */
  a: {
    color: '$accent',
    textDecoration: 'none',
    transition: 'color 200ms ease, opacity 200ms ease',
    '&:hover': {
      color: '$primaryDark',
    },
  },

  /* ── media ── */
  'img, svg, video': {
    display: 'block',
    maxWidth: '100%',
  },

  /* ── inputs ── */
  'input, button, textarea, select': {
    font: 'inherit',
    color: 'inherit',
  },

  /* ── focus visible ── */
  ':focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '3px',
  },

  /* ── selection ── */
  '::selection': {
    backgroundColor: 'rgba(16, 185, 129, 0.24)',
    color: '$text',
  },

  /* ── scrollbar (webkit) ── */
  '::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    background: '$gray300',
    borderRadius: '$full',
    '&:hover': {
      background: '$gray400',
    },
  },

  /* ── root container ── */
  '#root': {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
});
