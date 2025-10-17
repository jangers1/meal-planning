import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

export function useScrollShadows() {
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);

    // Keep the actual element in a ref; expose a callback ref to know exactly when it mounts/unmounts
    const elRef = useRef<HTMLDivElement | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);

    const updateShadows = () => {
        const el = elRef.current;
        if (!el) return;
        const {scrollTop, scrollHeight, clientHeight} = el;
        const top = scrollTop > 0;
        const bottom = scrollTop + clientHeight < scrollHeight - 1;
        setShowTopShadow(prev => (prev !== top ? top : prev));
        setShowBottomShadow(prev => (prev !== bottom ? bottom : prev));
    };

    const scheduleShadowUpdate = () => {
        if (rafIdRef.current != null) return;
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            updateShadows();
        });
    };

    // Callback ref so we can run an initial measurement when the element becomes available
    const scrollRef = useCallback((node: HTMLDivElement | null) => {
        // Detach cleanup
        if (node === null) {
            elRef.current = null;
            if (rafIdRef.current != null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            if (mutationObserverRef.current) {
                mutationObserverRef.current.disconnect();
                mutationObserverRef.current = null;
            }
            return;
        }
        // Attach
        elRef.current = node;

        // Observe size changes of the container
        if ('ResizeObserver' in window) {
            if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
            resizeObserverRef.current = new ResizeObserver(() => scheduleShadowUpdate());
            resizeObserverRef.current.observe(node);
        }

        // Observe content changes inside the container (new items, etc.)
        if ('MutationObserver' in window) {
            if (mutationObserverRef.current) mutationObserverRef.current.disconnect();
            mutationObserverRef.current = new MutationObserver(() => scheduleShadowUpdate());
            mutationObserverRef.current.observe(node, {childList: true, subtree: true});
        }

        // Use RAF to ensure styles/layout have been applied before measuring
        if (rafIdRef.current != null) {
            cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            updateShadows();
        });
    }, []);

    useEffect(() => {
        const handleResize = () => updateShadows();
        window.addEventListener('resize', handleResize);
        // If the element already exists on mount, ensure we compute once
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
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            if (mutationObserverRef.current) {
                mutationObserverRef.current.disconnect();
                mutationObserverRef.current = null;
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
