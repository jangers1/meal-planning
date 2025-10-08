import {Box, ListItemButton} from '@mui/joy';
import {styled} from '@mui/joy/styles';

const TRANSITION_WIDTH = '300ms cubic-bezier(0.4,0,0.2,1)';
const TRANSITION_HIGHLIGHT = '300ms cubic-bezier(0.33,0.66,0.4,1)';

export const NavContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'collapsed'
})<{ collapsed: boolean }>(({collapsed}) => ({
    width: collapsed ? '80px' : '225px',
    transition: `width ${TRANSITION_WIDTH}`,
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden'
}));

export const StyledListItemButton = styled(ListItemButton)(() => ({
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '48px',
    '&:hover': {
        backgroundColor: 'transparent !important',
    },
}));

export const IconContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '25px',
    height: '25px',
}));

export const TextContainer = styled(Box, {
    shouldForwardProp: (prop) => !['collapsed', 'show'].includes(String(prop))
})<{ collapsed: boolean; show: boolean }>(({collapsed, show}) => ({
    marginLeft: '12px',
    overflow: 'hidden',
    width: collapsed ? 0 : 'auto',
    opacity: show ? 1 : 0,
    transition: `width ${TRANSITION_WIDTH}, opacity ${collapsed ? '100ms' : '200ms'} ${collapsed ? '0ms' : '100ms'}`,
    whiteSpace: 'nowrap',
    flexShrink: 1,
}));

export const HighlightBox = styled(Box, {
    shouldForwardProp: (prop) => !['y', 'height', 'show'].includes(String(prop))
})<{ y: number; height: number; show: boolean }>(({y, height, show}) => ({
    position: 'absolute',
    left: '16px',
    right: '14px',
    top: 0,
    transform: `translate3d(0, ${y}px, 0)`,
    height: `${height}px`,
    borderRadius: '8px',
    transition: show
        ? `transform ${TRANSITION_HIGHLIGHT}, left ${TRANSITION_WIDTH}, right ${TRANSITION_WIDTH}`
        : 'none',
    opacity: height ? 1 : 0,
    zIndex: 1,
    boxShadow: "inset 3px 3px 7px rgba(136, 165, 191, 0.48), inset -3px -3px 7px #FFFFFF",
    willChange: 'transform',
}));

export const CollapseButton = styled(ListItemButton)(() => ({
    borderRadius: '8px',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
    minHeight: '40px',
    '&:hover': {backgroundColor: 'rgba(255,255,255,0.35)'},
    fontSize: '1.5rem',
}));

