import type { Appearance } from '@clerk/types'

/**
 * Foal & Pony brand theme for all Clerk components (sign in / sign up cards,
 * the modal, and the UserButton avatar + popover). Kept as a plain,
 * serialisable object so it can be passed from Server Components.
 *
 * Palette mirrors the CSS variables in app/globals.css.
 */
const orange = '#F39C12'
const orangeHover = '#E08E0B'
const navy = '#1F3A5C'
const cream = '#FFF8EE'
const line = 'rgba(31, 58, 92, 0.12)'

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: orange,
    colorText: navy,
    colorTextSecondary: 'rgba(31, 58, 92, 0.62)',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: navy,
    colorDanger: '#D2766E',
    colorSuccess: '#6DBE7A',
    borderRadius: '14px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: { normal: 500, medium: 600, bold: 700 },
  },
  elements: {
    // Card shell — soft, rounded, brand shadow. Matches site cards.
    card: {
      boxShadow: '0 30px 80px -32px rgba(31, 58, 92, 0.30)',
      border: `1px solid ${line}`,
      borderRadius: '24px',
      backgroundColor: '#FFFFFF',
    },
    headerTitle: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: navy,
    },
    headerSubtitle: { color: 'rgba(31, 58, 92, 0.62)' },

    // Primary CTA — brand orange pill.
    formButtonPrimary: {
      backgroundColor: orange,
      color: '#FFFFFF',
      fontWeight: 700,
      fontSize: '15px',
      textTransform: 'none',
      borderRadius: '999px',
      boxShadow: 'none',
      '&:hover': { backgroundColor: orangeHover },
      '&:focus': { boxShadow: `0 0 0 3px rgba(243, 156, 18, 0.35)` },
    },
    formFieldInput: {
      borderRadius: '12px',
      borderColor: line,
      '&:focus': { borderColor: orange, boxShadow: `0 0 0 3px rgba(243, 156, 18, 0.18)` },
    },
    formFieldLabel: { color: navy, fontWeight: 600 },

    // Social / connection buttons.
    socialButtonsBlockButton: {
      borderRadius: '12px',
      borderColor: line,
      '&:hover': { backgroundColor: cream },
    },

    footerActionLink: { color: orange, fontWeight: 700, '&:hover': { color: orangeHover } },
    identityPreviewEditButton: { color: orange },
    formResendCodeLink: { color: orange },

    // UserButton — avatar bubble + popover.
    userButtonAvatarBox: {
      width: '40px',
      height: '40px',
      boxShadow: `0 0 0 2px ${orange}`,
    },
    userButtonPopoverCard: {
      borderRadius: '20px',
      border: `1px solid ${line}`,
      boxShadow: '0 24px 60px -28px rgba(31, 58, 92, 0.32)',
    },
    userButtonPopoverActionButton: { '&:hover': { backgroundColor: cream } },
    userButtonPopoverFooter: { display: 'none' },

    // Hide the Clerk wordmark for a cleaner branded feel.
    footer: { display: 'none' },
  },
}
