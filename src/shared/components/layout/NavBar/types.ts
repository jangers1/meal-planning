import type {IconName} from '../../ui/LordIcon.tsx';

export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: IconName;
}

export interface NavBarProps {
    onItemSelect?: (itemId: string) => void;
}

export interface HighlightPosition {
    y: number;
    height: number;
}

