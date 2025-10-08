import React, {useEffect, useRef} from 'react';
import type {LordIconProps} from '../../ui/LordIcon.tsx';

interface UseIconAnimationsReturn {
    iconRefs: React.RefObject<Record<string, LordIconProps | null>>;
}

export const useIconAnimations = (activeItem: string): UseIconAnimationsReturn => {
    const iconRefs = useRef<Record<string, LordIconProps | null>>({});

    useEffect(() => {
        const activeIconRef = iconRefs.current[activeItem];
        if (activeIconRef) {
            activeIconRef.play();
        }
    }, [activeItem]);

    return {iconRefs};
};
