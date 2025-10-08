import {ListItem, Typography} from '@mui/joy';
import {LordIcon, type LordIconProps} from '../../ui/LordIcon.tsx';
import {IconContainer, StyledListItemButton, TextContainer} from './styles';
import type {NavItem as NavItemType} from './types';

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
            <StyledListItemButton
                ref={itemRef}
                onPointerDown={() => onPointerDown(item.id)}
                onClick={() => onItemClick(item.id)}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
            >
                <IconContainer>
                    <LordIcon icon={item.icon} ref={iconRef} />
                </IconContainer>
                <TextContainer collapsed={collapsed} show={!collapsed}>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: isActive ? '#000' : '#505050',
                            fontWeight: isActive ? 'bold' : 'normal'
                        }}
                    >
                        {item.label}
                    </Typography>
                </TextContainer>
            </StyledListItemButton>
        </ListItem>
    );
}

