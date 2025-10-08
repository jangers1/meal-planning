import type { SxProps } from '@mui/joy/styles/types';

/**
 * Reusable card style with gradient glow border effect and hover animations
 */
export const gradientGlowCardStyle: SxProps = {
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.28s ease, box-shadow 0.35s ease, background 0.6s ease',
    backgroundColor: 'background.surface',
    // Fancy gradient glow border using an overlay pseudo-element
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: '1px',
        background: 'linear-gradient(125deg, var(--joy-palette-primary-400), var(--joy-palette-warning-400), var(--joy-palette-success-400))',
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: 0,
        filter: 'blur(2px) saturate(1.2)',
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none'
    },
    '&:hover::before, &:focus-visible::before': {
        opacity: 1
    },
    '&:hover': {
        transform: 'scale(1.018)',
        boxShadow: 'lg',
        background: 'linear-gradient(140deg, var(--joy-palette-background-surface) 20%, var(--joy-palette-primary-softBg) 140%)'
    },
    '&:active': {
        transform: 'scale(1.01)',
        boxShadow: 'md'
    },
    '&:focus-visible': {
        outline: '2px solid var(--joy-palette-primary-outlinedBorder)',
        outlineOffset: 2,
        boxShadow: 'lg'
    }
};

/**
 * DND-safe card style with only gradient glow border effect
 * No hover effects or cursor changes to preserve drag-and-drop functionality
 */
export const gradientGlowBorderStyle: SxProps = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'background.surface',
    // Fancy gradient glow border using an overlay pseudo-element
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: '1px',
        background: 'linear-gradient(125deg, var(--joy-palette-primary-400), var(--joy-palette-warning-400), var(--joy-palette-success-400))',
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: 0.8,
        filter: 'blur(2px) saturate(1.2)',
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none'
    }
};