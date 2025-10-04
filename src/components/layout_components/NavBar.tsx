import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Box, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {styled} from '@mui/joy/styles';
import {useLocation, useNavigate} from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {useAlerts} from "../ui_components/alerts/AlertProvider.tsx";
import {type IconName, LordIcon, type LordIconProps} from '../LordIcon.tsx';

const DIMENSIONS = {
    COLLAPSED_WIDTH: '80px',
    EXPANDED_WIDTH: '225px',
} as const;

const COLORS = {
    ACTIVE: '#000',
    INACTIVE: '#505050',
} as const;

const TRANSITIONS = {
    WIDTH: '300ms cubic-bezier(0.4,0,0.2,1)',
    HIGHLIGHT: '300ms cubic-bezier(0.33,0.66,0.4,1)',
    PADDING: '180ms cubic-bezier(0.4,0,0.2,1)',
    BACKGROUND: '0.3s ease',
    HIGHLIGHT_DELAY: 190,
} as const;

// Types
interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: IconName; // Use proper IconName type
}

interface HighlightPosition {
    y: number;
    height: number;
}

interface NavBarProps {
    onItemSelect?: (itemId: string) => void;
}

// Navigation configuration
const NAV_ITEMS: NavItem[] = [
    {id: 'dashboard', label: 'Dashboard', path: '/', icon: 'chart' as IconName},
    {id: 'meal-plan', label: 'Meal Plan', path: '/meal-plan', icon: 'calender' as IconName},
    {id: 'recipes', label: 'Recipes', path: '/recipes', icon: 'book' as IconName},
    {id: 'pantry', label: 'Pantry', path: '/pantry', icon: 'grocery-shelf' as IconName},
];

const PATH_TO_ID_MAP: Record<string, string> = Object.fromEntries(
    NAV_ITEMS.map(item => [item.path, item.id])
);

// Styled Components
const NavContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'collapsed'
})<{ collapsed: boolean }>(({collapsed}) => ({
    width: collapsed ? DIMENSIONS.COLLAPSED_WIDTH : DIMENSIONS.EXPANDED_WIDTH,
    transition: `width ${TRANSITIONS.WIDTH}`,
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden'
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
    // Keep consistent padding to maintain icon positions
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '8px',
    transition: `background-color ${TRANSITIONS.BACKGROUND}`,
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '48px', // Ensure consistent height
    '&:hover': {
        backgroundColor: 'transparent !important',
    },
}));

// Icon container to keep icons properly positioned during collapse/expand
const IconContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // Prevent shrinking
    width: '25px', // Fixed width for consistent positioning
    height: '25px', // Fixed height
    position: 'relative',
}));

// New styled component for text container to handle smooth text transitions
const TextContainer = styled(Box, {
    shouldForwardProp: (prop) => !['collapsed', 'show'].includes(String(prop))
})<{ collapsed: boolean; show: boolean }>(({collapsed, show}) => ({
    marginLeft: '12px', // Fixed margin from icon
    overflow: 'hidden',
    width: collapsed ? 0 : 'auto',
    opacity: show ? 1 : 0,
    transition: `width ${TRANSITIONS.WIDTH}, opacity ${collapsed ? '100ms' : '200ms'} ${collapsed ? '0ms' : '150ms'}`,
    whiteSpace: 'nowrap',
    flexShrink: 1, // Allow text to shrink
}));

const HighlightBox = styled(Box, {
    shouldForwardProp: (prop) => !['y', 'height', 'show', 'collapsed'].includes(String(prop))
})<{
    y: number;
    height: number;
    show: boolean;
    collapsed: boolean;
}>(({y, height, show}) => ({
    position: 'absolute',
    left: '16px',
    right: '14px',
    top: 0,
    transform: `translate3d(0, ${y}px, 0)`,
    height: `${height}px`,
    borderRadius: '8px',
    transition: show
        ? `transform ${TRANSITIONS.HIGHLIGHT}, left ${TRANSITIONS.WIDTH}, right ${TRANSITIONS.WIDTH}`
        : 'none',
    opacity: height ? 1 : 0,
    zIndex: 1,
    boxShadow: 'inset 2px 2px 12px #c8d0e7, -2px -2px 12px #ffffff',
    willChange: 'transform',
}));

// Utility functions
const computeActiveItem = (pathname: string): string => {
    if (PATH_TO_ID_MAP[pathname]) {
        return PATH_TO_ID_MAP[pathname];
    }

    // Find the longest matching prefix (excluding root)
    const match = Object.keys(PATH_TO_ID_MAP)
        .filter(path => path !== '/')
        .sort((a, b) => b.length - a.length)
        .find(path => pathname.startsWith(path));

    return match ? PATH_TO_ID_MAP[match] : 'dashboard';
};

// Custom hooks
const useLocalStorage = (key: string, defaultValue: boolean) => {
    const [value, setValue] = useState<boolean>(() => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const saved = localStorage.getItem(key);
            return saved === 'true';
        } catch {
            return defaultValue;
        }
    });

    const alerts = useAlerts();

    const setStoredValue = useCallback((newValue: boolean | ((prev: boolean) => boolean)) => {
        const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
        setValue(valueToStore);
        try {
            localStorage.setItem(key, String(valueToStore));
        } catch {
            alerts.pushError('Failed to save navigation state');
        }
    }, [key, alerts, value]);

    return [value, setStoredValue] as const;
};

const useHighlightPosition = (activeItem: string, collapsed: boolean) => {
    const [highlightPosition, setHighlightPosition] = useState<HighlightPosition>({y: 0, height: 0});
    const [showTransition, setShowTransition] = useState(false);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});
    const iconRefs = useRef<Record<string, LordIconProps | null>>({});
    const listRef = useRef<HTMLUListElement>(null);

    const updateHighlight = useCallback((itemId: string) => {
        const itemElement = itemRefs.current[itemId];
        const listElement = listRef.current;

        if (itemElement && listElement) {
            const listRect = listElement.getBoundingClientRect();
            const itemRect = itemElement.getBoundingClientRect();
            const relativeTop = itemRect.top - listRect.top;

            setHighlightPosition(prev => {
                if (prev.y === relativeTop && prev.height === itemRect.height) {
                    return prev;
                }
                return {y: relativeTop, height: itemRect.height};
            });
        }
    }, []);

    useLayoutEffect(() => {
        updateHighlight(activeItem);
        if (!showTransition) {
            requestAnimationFrame(() => setShowTransition(true));
        }
    }, [activeItem, updateHighlight, showTransition]);

    useEffect(() => {
        const handleResize = () => updateHighlight(activeItem);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeItem, updateHighlight]);

    useEffect(() => {
        const timeoutId = setTimeout(() => updateHighlight(activeItem), TRANSITIONS.HIGHLIGHT_DELAY);
        return () => clearTimeout(timeoutId);
    }, [collapsed, activeItem, updateHighlight]);

    return {
        highlightPosition,
        showTransition,
        itemRefs,
        iconRefs,
        listRef,
        updateHighlight,
    };
};

// Main component
function NavBar({onItemSelect}: NavBarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string>(() => computeActiveItem(location.pathname));
    const [collapsed, setCollapsed] = useLocalStorage('navCollapsed', false);

    const {
        highlightPosition,
        showTransition,
        itemRefs,
        iconRefs,
        listRef,
        updateHighlight,
    } = useHighlightPosition(activeItem, collapsed);

    // Update active item based on location
    useEffect(() => {
        setActiveItem(prev => {
            const computed = computeActiveItem(location.pathname);
            return computed === prev ? prev : computed;
        });
    }, [location.pathname]);

    // Control icon animations based on active item changes
    useEffect(() => {
        NAV_ITEMS.forEach(item => {
            const iconRef = iconRefs.current[item.id];
            if (iconRef && item.id === activeItem) {
                // Only play animation for the active item
                iconRef.play();
            }
        });
    }, [activeItem, iconRefs]);

    // Handlers
    const handleItemClick = useCallback((itemId: string) => {
        setActiveItem(itemId);
        const targetItem = NAV_ITEMS.find(item => item.id === itemId);
        if (targetItem) {
            navigate(targetItem.path);
        }
        onItemSelect?.(itemId);
    }, [navigate, onItemSelect]);

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev: boolean) => !prev);
    }, [setCollapsed]);

    // Memoized nav items to prevent unnecessary re-renders
    const navItemElements = useMemo(() =>
            NAV_ITEMS.map((item) => {
                const isActive = activeItem === item.id;

                return (
                    <ListItem key={item.id} sx={{p: 0}}>
                        <StyledListItemButton
                            ref={(el) => {
                                itemRefs.current[item.id] = el;
                            }}
                            onPointerDown={() => updateHighlight(item.id)}
                            onClick={() => handleItemClick(item.id)}
                            aria-label={collapsed ? item.label : undefined}
                            title={collapsed ? item.label : undefined}
                        >
                            <IconContainer>
                                <LordIcon
                                    icon={item.icon}
                                    ref={(el: LordIconProps | null) => {
                                        iconRefs.current[item.id] = el;
                                    }}
                                />
                            </IconContainer>
                            <TextContainer collapsed={collapsed} show={!collapsed}>
                                <Typography
                                    level="body-lg"
                                    sx={{
                                        color: isActive ? COLORS.ACTIVE : COLORS.INACTIVE,
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </TextContainer>
                        </StyledListItemButton>
                    </ListItem>
                );
            })
        , [activeItem, collapsed, handleItemClick, updateHighlight, itemRefs, iconRefs]);

    return (
        <NavContainer collapsed={collapsed}>
            <List
                ref={listRef}
                sx={{
                    flexGrow: 1,
                    py: 2,
                    position: 'relative'
                }}
            >
                <HighlightBox
                    y={highlightPosition.y}
                    height={highlightPosition.height}
                    show={showTransition}
                    collapsed={collapsed}
                />
                {navItemElements}
            </List>

            <Box sx={{p: 1, borderTop: '1px solid rgba(0,0,0,0.06)'}}>
                <ListItemButton
                    onClick={toggleCollapsed}
                    sx={{
                        borderRadius: '8px',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        minHeight: '40px', // Consistent height for collapse button
                        '&:hover': {backgroundColor: 'rgba(255,255,255,0.35)'},
                        fontSize: '1.5rem',
                    }}
                    aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <ChevronRightRoundedIcon/> : <ChevronLeftRoundedIcon/>}
                </ListItemButton>
            </Box>
        </NavContainer>
    );
}

export default NavBar;