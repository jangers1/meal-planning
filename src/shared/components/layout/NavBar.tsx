import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, List, Typography} from '@mui/joy';
import {useLocation, useNavigate} from 'react-router-dom';
import {getActiveItemFromPath, NAV_ITEMS} from './NavBar/config.ts';
import {NavItem} from './NavBar/NavItem.tsx';
import {useHighlightAnimation} from './NavBar/useHighlightAnimation.ts';
import {useIconAnimations} from './NavBar/useIconAnimations.ts';
import {useLocalStorageState} from './NavBar/useLocalStorageState.ts';
import type {NavBarProps} from './NavBar/types.ts';
import BottomBar from "./NavBar/BottomBar.tsx";
import Clock from "./NavBar/Clock.tsx";
import {useNavBarCollapseAnimation} from "./NavBar/useNavBarCollapseAnimation.ts";

const TRANSITION_WIDTH = '300ms cubic-bezier(0.4,0,0.2,1)';
const TRANSITION_HIGHLIGHT = '300ms cubic-bezier(0.33,0.66,0.4,1)';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let date = new Date();

function NavBar({onItemSelect}: NavBarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string>(() =>
        getActiveItemFromPath(location.pathname)
    );
    const [collapsed, setCollapsed] = useLocalStorageState('navCollapsed', false);
    const clockContainerRef = useRef<HTMLDivElement>(null);
    const dateBoxRef = useRef<HTMLDivElement>(null);

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

    const toggleCollapsed = useNavBarCollapseAnimation(
        clockContainerRef as React.RefObject<HTMLDivElement>,
        dateBoxRef as React.RefObject<HTMLDivElement>,
        setCollapsed
    );

    return (
        <Box sx={{
            width: collapsed ? '80px' : '250px',
            transition: `width ${TRANSITION_WIDTH}`,
            height: '100%',
            backgroundColor: 'var(--primary-color)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box
                ref={clockContainerRef}
                sx={{
                    mt: collapsed ? 1 : 2,
                    mb: collapsed ? 2 : 4,
                    mx: 3,
                    display: 'flex',
                    flexDirection: collapsed ? 'column' : 'row',
                    alignItems: 'center',
                    gap: collapsed ? 0 : 1,
                    transition: `margin 300ms cubic-bezier(0.4,0,0.2,1), gap 300ms cubic-bezier(0.4,0,0.2,1)`,
                }}
            >
                <Clock collapsed={collapsed}/>
                <Box
                    ref={dateBoxRef}
                    sx={{
                        flexGrow: 1,
                        textAlign: collapsed ? 'center' : 'right',
                        willChange: 'transform',
                    }}
                >
                    <Typography level={'h4'}>
                        {collapsed ? DAYS_SHORT[date.getDay()] : DAYS[date.getDay()]}
                    </Typography>
                    <Typography level={'body-lg'}>
                        {collapsed
                            ? `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
                            : `${date.getDate()} ${MONTHS[date.getMonth()]}`
                        }
                    </Typography>
                </Box>
            </Box>

            <List ref={listRef} sx={{flexGrow: 1, p: 0, position: 'relative'}}>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '16px',
                        right: '14px',
                        top: 0,
                        transform: `translate3d(0, ${highlightPosition.y}px, 0)`,
                        height: `${highlightPosition.height}px`,
                        borderRadius: '8px',
                        transition: showTransition
                            ? `transform ${TRANSITION_HIGHLIGHT}, left ${TRANSITION_WIDTH}, right ${TRANSITION_WIDTH}`
                            : 'none',
                        opacity: highlightPosition.height ? 1 : 0,
                        zIndex: 1,
                        boxShadow: "inset 3px 3px 7px rgba(136, 165, 191, 0.48), inset -3px -3px 7px #FFFFFF",
                        willChange: 'transform',
                    }}
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

            <BottomBar
                collapseHandler={toggleCollapsed}
                isCollapsed={collapsed}
                transitionWidth={TRANSITION_WIDTH}
            />
        </Box>
    );
}

export default NavBar;
