import {useEffect, useMemo, useRef, useState} from 'react';

export function useScrollShadows() {
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const updateShadows = () => {
        const el = scrollRef.current;
        if (!el) return;
        const {scrollTop, scrollHeight, clientHeight} = el;
        const top = scrollTop > 0;
        const bottom = scrollTop + clientHeight < scrollHeight - 1;
        setShowTopShadow(prev => prev !== top ? top : prev);
        setShowBottomShadow(prev => prev !== bottom ? bottom : prev);
    };

    const scheduleShadowUpdate = () => {
        if (rafIdRef.current != null) return;
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            updateShadows();
        });
    };

    useEffect(() => {
        const handleResize = () => updateShadows();
        window.addEventListener('resize', handleResize);
        const id = requestAnimationFrame(updateShadows);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(id);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current != null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    const scrollStatusMessage = useMemo(() => {
        if (showTopShadow && showBottomShadow) return 'More content above and below';
        if (showTopShadow) return 'More content above';
        if (showBottomShadow) return 'More content below';
        return 'Start or end of list';
    }, [showTopShadow, showBottomShadow]);

    return {
        scrollRef,
        showTopShadow,
        showBottomShadow,
        scrollStatusMessage,
        handleScroll: scheduleShadowUpdate
    };
}

