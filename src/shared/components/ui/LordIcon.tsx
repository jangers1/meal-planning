import {forwardRef, useImperativeHandle, useRef} from 'react';
import {Player} from '@lordicon/react';
import book from '../../assets/icons/book.json';
import calender from '../../assets/icons/calender.json';
import chart from '../../assets/icons/chart.json';
import groceryShelf from '../../assets/icons/grocery-shelf.json';
import basket from '../../assets/icons/basket.json';
import settings from '../../assets/icons/settings.json';
import arrows from '../../assets/icons/arrows.json';

// Icon mapping
const ICON_MAP = {
    'book': book,
    'calender': calender,
    'chart': chart,
    'grocery-shelf': groceryShelf,
    'basket': basket,
    'settings': settings,
    'arrows': arrows
} as const;

export type IconName = keyof typeof ICON_MAP;

export type LordIconProps = {
    play: () => void;
};

interface LordIconComponentProps {
    icon: IconName;
    size?: number;
}

const LordIcon = forwardRef<LordIconProps, LordIconComponentProps>(({icon, size = 25}, ref) => {
    const playerRef = useRef<Player>(null);

    useImperativeHandle(ref, () => ({
        play: () => {
            if (playerRef.current) {
                playerRef.current.playFromBeginning();
            }
        }
    }));

    const iconData = ICON_MAP[icon];

    return (
        <Player
            icon={iconData}
            ref={playerRef}
            size={size}
            state={'morph-open'}
        />
    );
});

export {LordIcon};
