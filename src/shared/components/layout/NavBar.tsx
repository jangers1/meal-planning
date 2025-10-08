import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Box, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {styled} from '@mui/joy/styles';
import {useLocation, useNavigate} from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {useAlerts} from '../ui/alerts/AlertProvider.tsx';
import {type IconName, LordIcon, type LordIconProps} from '../ui/LordIcon.tsx';

// Constants
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
    BACKGROUND: '0.3s ease',
    TEXT_OPACITY: '200ms',
    TEXT_DELAY: '100ms',
    HIGHLIGHT_DELAY: 190,
} as const;

// Types
interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: IconName;
}

interface HighlightPosition {
    y: number;
    height: number;
}

interface NavBarProps {
    onItemSelect?: (itemId: string) => void;
}

// Navigation configuration
const NAV_ITEMS: readonly NavItem[] = [
    {id: 'dashboard', label: 'Dashboard', path: '/', icon: 'chart'},
    {id: 'meal-plan', label: 'Meal Plan', path: '/meal-plan', icon: 'calender'},
    {id: 'recipes', label: 'Recipes', path: '/recipes', icon: 'book'},
    {id: 'pantry', label: 'Pantry', path: '/pantry', icon: 'grocery-shelf'},
] as const;

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
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '8px',
    transition: `background-color ${TRANSITIONS.BACKGROUND}`,
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

const IconContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '25px',
    height: '25px',
}));

const TextContainer = styled(Box, {
    shouldForwardProp: (prop) => !['collapsed', 'show'].includes(String(prop))
})<{ collapsed: boolean; show: boolean }>(({collapsed, show}) => ({
    marginLeft: '12px',
    overflow: 'hidden',
    width: collapsed ? 0 : 'auto',
    opacity: show ? 1 : 0,
    transition: `width ${TRANSITIONS.WIDTH}, opacity ${collapsed ? '100ms' : TRANSITIONS.TEXT_OPACITY} ${collapsed ? '0ms' : TRANSITIONS.TEXT_DELAY}`,
    whiteSpace: 'nowrap',
    flexShrink: 1,
}));

const HighlightBox = styled(Box, {
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
        ? `transform ${TRANSITIONS.HIGHLIGHT}, left ${TRANSITIONS.WIDTH}, right ${TRANSITIONS.WIDTH}`
        : 'none',
    opacity: height ? 1 : 0,
    zIndex: 1,
    boxShadow: "inset 3px 3px 7px rgba(136, 165, 191, 0.48), inset -3px -3px 7px #FFFFFF",
    willChange: 'transform',
}));

const CollapseButton = styled(ListItemButton)(() => ({
    borderRadius: '8px',
    justifyContent: 'center',
    transition: `background-color ${TRANSITIONS.BACKGROUND}`,
    minHeight: '40px',
    '&:hover': {backgroundColor: 'rgba(255,255,255,0.35)'},
    fontSize: '1.5rem',
}));

// Utility functions
const getActiveItemFromPath = (pathname: string): string => {
    if (PATH_TO_ID_MAP[pathname]) {
        return PATH_TO_ID_MAP[pathname];
    }

    // Find the longest matching prefix (excluding root)
    const matchingPath = Object.keys(PATH_TO_ID_MAP)
        .filter(path => path !== '/')
        .sort((a, b) => b.length - a.length)
        .find(path => pathname.startsWith(path));

    return matchingPath ? PATH_TO_ID_MAP[matchingPath] : 'dashboard';
};

// Custom hooks
const useLocalStorageState = (key: string, defaultValue: boolean) => {
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

const useHighlightAnimation = (activeItem: string, collapsed: boolean) => {
    const [highlightPosition, setHighlightPosition] = useState<HighlightPosition>({y: 0, height: 0});
    const [showTransition, setShowTransition] = useState(false);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});
    const listRef = useRef<HTMLUListElement>(null);

    const updateHighlightPosition = useCallback((itemId: string) => {
        const itemElement = itemRefs.current[itemId];
        const listElement = listRef.current;

        if (!itemElement || !listElement) return;

        const listRect = listElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();
        const relativeTop = itemRect.top - listRect.top;

        setHighlightPosition(prev => {
            if (prev.y === relativeTop && prev.height === itemRect.height) {
                return prev;
            }
            return {y: relativeTop, height: itemRect.height};
        });
    }, []);

    // Initialize transition animation
    useLayoutEffect(() => {
        updateHighlightPosition(activeItem);
        if (!showTransition) {
            requestAnimationFrame(() => setShowTransition(true));
        }
    }, [activeItem, updateHighlightPosition, showTransition]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => updateHighlightPosition(activeItem);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeItem, updateHighlightPosition]);

    // Update highlight position after collapse/expand animation
    useEffect(() => {
        const timeoutId = setTimeout(
            () => updateHighlightPosition(activeItem),
            TRANSITIONS.HIGHLIGHT_DELAY
        );
        return () => clearTimeout(timeoutId);
    }, [collapsed, activeItem, updateHighlightPosition]);

    return {
        highlightPosition,
        showTransition,
        itemRefs,
        listRef,
        updateHighlightPosition,
    };
};

const useIconAnimations = (activeItem: string) => {
    const iconRefs = useRef<Record<string, LordIconProps | null>>({});

    useEffect(() => {
        const activeIconRef = iconRefs.current[activeItem];
        if (activeIconRef) {
            activeIconRef.play();
        }
    }, [activeItem]);

    return {iconRefs};
};

// Main component
function NavBar({onItemSelect}: NavBarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string>(() =>
        getActiveItemFromPath(location.pathname)
    );
    const [collapsed, setCollapsed] = useLocalStorageState('navCollapsed', false);

    const {highlightPosition, showTransition, itemRefs, listRef, updateHighlightPosition} =
        useHighlightAnimation(activeItem, collapsed);
    const {iconRefs} = useIconAnimations(activeItem);

    // Update active item when route changes
    useEffect(() => {
        const newActiveItem = getActiveItemFromPath(location.pathname);
        if (newActiveItem !== activeItem) {
            setActiveItem(newActiveItem);
        }
    }, [location.pathname, activeItem]);

    // Event handlers
    const handleItemClick = useCallback((itemId: string) => {
        const targetItem = NAV_ITEMS.find(item => item.id === itemId);
        if (!targetItem) return;

        setActiveItem(itemId);
        navigate(targetItem.path);
        onItemSelect?.(itemId);
    }, [navigate, onItemSelect]);

    const toggleCollapsed = useCallback(() => {
        setCollapsed(prev => !prev);
    }, [setCollapsed]);

    // Render nav items
    const navItemElements = useMemo(() =>
            NAV_ITEMS.map((item) => {
                const isActive = activeItem === item.id;

                return (
                    <ListItem key={item.id} sx={{p: 0}}>
                        <StyledListItemButton
                            ref={el => {
                                itemRefs.current[item.id] = el;
                            }}
                            onPointerDown={() => updateHighlightPosition(item.id)}
                            onClick={() => handleItemClick(item.id)}
                            aria-label={collapsed ? item.label : undefined}
                            title={collapsed ? item.label : undefined}
                        >
                            <IconContainer>
                                <LordIcon
                                    icon={item.icon}
                                    ref={el => {
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
            }),
        [activeItem, collapsed, handleItemClick, updateHighlightPosition, iconRefs, itemRefs]
    );

    return (
        <NavContainer collapsed={collapsed}>
            <List ref={listRef} sx={{flexGrow: 1, py: 2, position: 'relative'}}>
                <HighlightBox
                    y={highlightPosition.y}
                    height={highlightPosition.height}
                    show={showTransition}
                />
                {navItemElements}
            </List>

            <Box sx={{p: 1, borderTop: '1px solid rgba(0,0,0,0.06)'}}>
                <CollapseButton
                    onClick={toggleCollapsed}
                    aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <ChevronRightRoundedIcon/> : <ChevronLeftRoundedIcon/>}
                </CollapseButton>
            </Box>
        </NavContainer>
    );
}

export default NavBar;
