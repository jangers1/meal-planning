import {useLayoutEffect, useRef, useState} from 'react';
import {Box, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {styled} from '@mui/joy/styles';

const boldFont = 600;
const normalFont = 400;

// Styled container for the navigation bar
const NavContainer = styled(Box)(() => ({
    width: '200px',
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
}));

// Styled list item button without individual active styling
const StyledListItemButton = styled(ListItemButton)(() => ({
    padding: '16px 24px',
    margin: '4px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    position: 'relative',
    zIndex: 2,
    '&:hover': {
        backgroundColor: 'transparent !important', // Removes default hover background
    },
}));

// Animated highlight box
const HighlightBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'showTransition'
})<{ top: number; height: number; showTransition: boolean }>(({
                                                                  top,
                                                                  height,
                                                                  showTransition
                                                              }) => ({
    position: 'absolute',
    left: '12px',
    right: '12px',
    top: `${top}px`,
    height: `${height}px`,
    borderRadius: '8px',
    transition: showTransition ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    zIndex: 1,
    boxShadow: 'inset 2px 2px 12px #c8d0e7, -2px -2px 12px #ffffff',
}));

// Navigation items data
const navItems = [
    {id: 'dashboard', label: 'Dashboard'},
    {id: 'meal-plan', label: 'Meal Plan'},
    {id: 'recipes', label: 'Recipes'},
    {id: 'pantry', label: 'Pantry'}
];

interface NavBarProps {
    onItemSelect?: (itemId: string) => void;
}

function NavBar({onItemSelect}: NavBarProps) {
    const [activeItem, setActiveItem] = useState('dashboard');
    const [highlightPosition, setHighlightPosition] = useState({top: 0, height: 0});
    const [showTransition, setShowTransition] = useState(false);
    const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const listRef = useRef<HTMLUListElement>(null);

    const updateHighlight = (itemId: string) => {
        const itemElement = itemRefs.current[itemId];
        const listElement = listRef.current;

        if (itemElement && listElement) {
            const listRect = listElement.getBoundingClientRect();
            const itemRect = itemElement.getBoundingClientRect();
            const relativeTop = itemRect.top - listRect.top;

            setHighlightPosition({
                top: relativeTop,
                height: itemRect.height,
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

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        onItemSelect?.(itemId);
    };

    return (
        <NavContainer>
            <List
                ref={listRef}
                sx={{
                    flexGrow: 1,
                    py: 2,
                    position: 'relative'
                }}
            >
                <HighlightBox
                    top={highlightPosition.top}
                    height={highlightPosition.height}
                    showTransition={showTransition}
                />
                {navItems.map((item) => (
                    <ListItem
                        key={item.id}
                        sx={{p: 0}}
                    >
                        <StyledListItemButton
                            ref={(el) => {
                                itemRefs.current[item.id] = el;
                            }}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <Typography
                                level="body-md"
                                sx={{
                                    color: activeItem === item.id ? 'black' : '#2f2f2f',
                                    fontWeight: activeItem === item.id ? boldFont : normalFont,
                                    fontSize: '1rem'
                                }}
                            >
                                {item.label}
                            </Typography>
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </List>
        </NavContainer>
    );
}

export default NavBar;