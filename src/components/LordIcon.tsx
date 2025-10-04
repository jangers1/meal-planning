import {forwardRef, useImperativeHandle, useRef} from 'react';
import {Player} from '@lordicon/react';
import book from '../assets/icons/book.json';
import calender from '../assets/icons/calender.json';
import chart from '../assets/icons/chart.json';
import groceryShelf from '../assets/icons/grocery-shelf.json';

// Icon mapping
const ICON_MAP = {
    'book': book,
    'calender': calender,
    'chart': chart,
    'grocery-shelf': groceryShelf,
} as const;

export type IconName = keyof typeof ICON_MAP;

export type LordIconProps = {
    play: () => void;
};

interface LordIconComponentProps {
    icon: IconName;
}

const LordIcon = forwardRef<LordIconProps, LordIconComponentProps>(({ icon }, ref) => {
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
            size={25}
            state={'morph-open'}
        />
    );
});

export { LordIcon };
