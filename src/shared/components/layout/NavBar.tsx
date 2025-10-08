import {useCallback, useEffect, useState} from 'react';
import {Box, List} from '@mui/joy';
import {useLocation, useNavigate} from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {getActiveItemFromPath, NAV_ITEMS} from './NavBar/config.ts';
import {CollapseButton, HighlightBox, NavContainer} from './NavBar/styles.ts';
import {NavItem} from './NavBar/NavItem.tsx';
import {useHighlightAnimation} from './NavBar/useHighlightAnimation.ts';
import {useIconAnimations} from './NavBar/useIconAnimations.ts';
import {useLocalStorageState} from './NavBar/useLocalStorageState.ts';
import type {NavBarProps} from './NavBar/types.ts';

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

    return (
        <NavContainer collapsed={collapsed}>
            <List ref={listRef} sx={{flexGrow: 1, py: 2, position: 'relative'}}>
                <HighlightBox
                    y={highlightPosition.y}
                    height={highlightPosition.height}
                    show={showTransition}
                />
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.id}
                        item={item}
                        isActive={activeItem === item.id}
                        collapsed={collapsed}
                        onItemClick={handleItemClick}
                        onPointerDown={updateHighlightPosition}
                        itemRef={el => {
                            itemRefs.current[item.id] = el;
                        }}
                        iconRef={el => {
                            iconRefs.current[item.id] = el;
                        }}
                    />
                ))}
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
