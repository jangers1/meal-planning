import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Box, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {styled} from '@mui/joy/styles';
import {useLocation, useNavigate} from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {useAlerts} from "../ui_components/alerts/AlertProvider.tsx";

const boldFont = 600;
const normalFont = 400;

// Styled container for the navigation bar (collapsible)
const NavContainer = styled(Box, {shouldForwardProp: (prop) => prop !== 'collapsed'})<{
    collapsed: boolean
}>(({collapsed}) => ({
    width: collapsed ? '68px' : '200px',
    transition: 'width 300ms cubic-bezier(0.4,0,0.2,1)',
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden'
}));

// Styled list item button without individual active styling
const StyledListItemButton = styled(ListItemButton, {shouldForwardProp: (prop) => prop !== 'collapsed'})<{
    collapsed?: boolean
}>(({collapsed}) => ({
    padding: collapsed ? '12px 16px' : '16px 24px',
    margin: '4px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, padding 180ms cubic-bezier(0.4,0,0.2,1)',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: collapsed ? 0 : '12px',
    '&:hover': {
        backgroundColor: 'transparent !important',
    },
}));

// Animated highlight box (transform-based for better Chrome perf)
const HighlightBox = styled(Box, {shouldForwardProp: (prop) => !['y', 'height', 'show', 'collapsed'].includes(String(prop))})<{
    y: number;
    height: number;
    show: boolean;
    collapsed: boolean
}>(({y, height, show, collapsed}) => ({
    position: 'absolute',
    left: collapsed ? '8px' : '12px',
    right: collapsed ? '8px' : '12px',
    top: 0,
    transform: `translate3d(0, ${y}px, 0)`,
    height: `${height}px`,
    borderRadius: '8px',
    transition: show ? 'transform 300ms cubic-bezier(0.33,0.66,0.4,1), left 180ms, right 180ms' : 'none',
    opacity: height ? 1 : 0,
    zIndex: 1,
    boxShadow: 'inset 2px 2px 12px #c8d0e7, -2px -2px 12px #ffffff',
    willChange: 'transform',
}));

// Navigation items data WITH icons
const navItems = [
    {id: 'dashboard', label: 'Dashboard', path: '/', icon: DashboardRoundedIcon},
    {id: 'meal-plan', label: 'Meal Plan', path: '/meal-plan', icon: CalendarMonthRoundedIcon},
    {id: 'recipes', label: 'Recipes', path: '/recipes', icon: MenuBookRoundedIcon},
    {id: 'pantry', label: 'Pantry', path: '/pantry', icon: KitchenIcon},
];

// Move pathToId map outside component so its identity is stable
const pathToId: Record<string, string> = {
    '/': 'dashboard',
    '/meal-plan': 'meal-plan',
    '/recipes': 'recipes',
    '/pantry': 'pantry'
};

// Helper to compute active item from a pathname (supports nested routes like /recipes/slug)
function computeActiveItem(pathname: string): string {
    if (pathToId[pathname]) return pathToId[pathname];
    // Try the longest matching prefix (excluding root)
    const match = Object.keys(pathToId)
        .filter(p => p !== '/')
        .sort((a, b) => b.length - a.length)
        .find(p => pathname.startsWith(p));
    return match ? pathToId[match] : 'dashboard';
}

interface NavBarProps {
    onItemSelect?: (itemId: string) => void;
}

function NavBar({onItemSelect}: NavBarProps) {
    const alerts = useAlerts()

    const location = useLocation();
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string>(() => computeActiveItem(location.pathname));
    const [highlightPosition, setHighlightPosition] = useState({y: 0, height: 0});
    const [showTransition, setShowTransition] = useState(false);
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        try {
            const saved = localStorage.getItem('navCollapsed');
            return saved === 'true';
        } catch {
            return false;
        }
    });
    const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const listRef = useRef<HTMLUListElement>(null);

    const updateHighlight = (itemId: string) => {
        const itemElement = itemRefs.current[itemId];
        const listElement = listRef.current;
        if (itemElement && listElement) {
            const listRect = listElement.getBoundingClientRect();
            const itemRect = itemElement.getBoundingClientRect();
            const relativeTop = itemRect.top - listRect.top;
            setHighlightPosition(prev => {
                if (prev.y === relativeTop && prev.height === itemRect.height) return prev;
                return {y: relativeTop, height: itemRect.height};
            });
        }
    };

    // Single effect to handle initialization and updates
    useLayoutEffect(() => {
        updateHighlight(activeItem);

        // Enable transitions after first render
        if (!showTransition) {
            requestAnimationFrame(() => setShowTransition(true));
        }
    }, [activeItem, showTransition]);

    useEffect(() => {
        // Functional update to avoid needing activeItem in deps
        setActiveItem(prev => {
            const computed = computeActiveItem(location.pathname);
            return computed === prev ? prev : computed;
        });
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => updateHighlight(activeItem);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeItem]);

    useEffect(() => {
        try {
            localStorage.setItem('navCollapsed', String(collapsed));
        } catch {
            alerts.pushError('Failed to save navigation state');
        }
        // Re-run highlight after width transition completes
        const id = setTimeout(() => updateHighlight(activeItem), 190);
        return () => clearTimeout(id);
    }, [collapsed, activeItem, alerts]);

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        const target = navItems.find(n => n.id === itemId);
        if (target) {
            navigate(target.path);
        }
        onItemSelect?.(itemId);
    };

    const toggleCollapsed = () => setCollapsed(c => !c);

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
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <ListItem key={item.id} sx={{p: 0}}>
                            <StyledListItemButton
                                collapsed={collapsed}
                                ref={(el) => {
                                    itemRefs.current[item.id] = el;
                                }}
                                onPointerDown={() => updateHighlight(item.id)}
                                onClick={() => handleItemClick(item.id)}
                                aria-label={collapsed ? item.label : undefined}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon style={{fontSize: 22, color: activeItem === item.id ? '#000' : '#2f2f2f'}}/>
                                {!collapsed && (
                                    <Typography
                                        level="body-md"
                                        sx={{
                                            color: activeItem === item.id ? 'black' : '#2f2f2f',
                                            fontWeight: activeItem === item.id ? boldFont : normalFont,
                                            fontSize: '1rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                )}
                            </StyledListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{p: 1, borderTop: '1px solid rgba(0,0,0,0.06)'}}>
                <ListItemButton
                    onClick={toggleCollapsed}
                    sx={{
                        borderRadius: '8px',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        '&:hover': {backgroundColor: 'rgba(255,255,255,0.35)'}
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
