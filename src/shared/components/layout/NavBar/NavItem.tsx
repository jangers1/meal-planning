import {Box, ListItem, ListItemButton, Typography} from '@mui/joy';
import {LordIcon, type LordIconProps} from '../../ui/LordIcon.tsx';
import type {NavItem as NavItemType} from './types';

const TRANSITION_WIDTH = '300ms cubic-bezier(0.4,0,0.2,1)';

interface NavItemProps {
    item: NavItemType;
    isActive: boolean;
    collapsed: boolean;
    onItemClick: (itemId: string) => void;
    onPointerDown: (itemId: string) => void;
    itemRef: (el: HTMLElement | null) => void;
    iconRef: (el: LordIconProps | null) => void;
}

export function NavItem({
                            item,
                            isActive,
                            collapsed,
                            onItemClick,
                            onPointerDown,
                            itemRef,
                            iconRef
                        }: NavItemProps) {
    return (
        <ListItem sx={{p: 0}}>
            <ListItemButton
                ref={itemRef}
                onPointerDown={() => onPointerDown(item.id)}
                onClick={() => onItemClick(item.id)}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                sx={{
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
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: '25px',
                    height: '25px',
                }}>
                    <LordIcon icon={item.icon} ref={iconRef}/>
                </Box>
                <Box sx={{
                    marginLeft: '12px',
                    overflow: 'hidden',
                    width: collapsed ? 0 : 'auto',
                    opacity: !collapsed ? 1 : 0,
                    transition: `width ${TRANSITION_WIDTH}, opacity ${collapsed ? '100ms' : '200ms'} ${collapsed ? '0ms' : '100ms'}`,
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                }}>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: isActive ? '#000' : '#505050',
                            fontWeight: isActive ? 'bold' : 'normal'
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            </ListItemButton>
        </ListItem>
    );
}
