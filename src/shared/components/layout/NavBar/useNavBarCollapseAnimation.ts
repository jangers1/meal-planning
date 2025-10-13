import React, {useCallback} from 'react';

export function useNavBarCollapseAnimation(
    clockContainerRef: React.RefObject<HTMLDivElement>,
    dateBoxRef: React.RefObject<HTMLDivElement>,
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
) {
    return (useCallback(() => {
        const clockContainer = clockContainerRef.current;
        const dateBox = dateBoxRef.current;

        if (clockContainer && dateBox) {
            const dateRect = dateBox.getBoundingClientRect();
            const oldDateX = dateRect.left;
            const oldDateY = dateRect.top;

            dateBox.style.transition = 'opacity 150ms ease-out';
            dateBox.style.opacity = '0';

            setTimeout(() => {
                setCollapsed(prev => !prev);

                requestAnimationFrame(() => {
                    if (clockContainer && dateBox) {
                        const newDateRect = dateBox.getBoundingClientRect();
                        const deltaX = oldDateX - newDateRect.left;
                        const deltaY = oldDateY - newDateRect.top;

                        if (deltaX !== 0 || deltaY !== 0) {
                            dateBox.style.transition = 'none';
                            dateBox.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                            dateBox.offsetHeight;
                            dateBox.style.transition = 'transform 300ms cubic-bezier(0.4,0,0.2,1)';
                            dateBox.style.transform = 'translate(0, 0)';
                            setTimeout(() => {
                                dateBox.style.transition = 'opacity 150ms ease-in';
                                dateBox.style.opacity = '1';
                            }, 300);
                        } else {
                            dateBox.style.transition = 'opacity 150ms ease-in';
                            dateBox.style.opacity = '1';
                        }
                    }
                });
            }, 150);
        } else {
            setCollapsed(prev => !prev);
        }
    }, [clockContainerRef, dateBoxRef, setCollapsed]));
}