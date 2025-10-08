import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {HighlightPosition} from './types';

interface UseHighlightAnimationReturn {
    highlightPosition: HighlightPosition;
    showTransition: boolean;
    itemRefs: React.RefObject<Record<string, HTMLElement | null>>;
    listRef: React.RefObject<HTMLUListElement | null>;
    updateHighlightPosition: (itemId: string) => void;
}

export const useHighlightAnimation = (activeItem: string, collapsed: boolean): UseHighlightAnimationReturn => {
    const [highlightPosition, setHighlightPosition] = useState<HighlightPosition>({y: 0, height: 0});
    const [showTransition, setShowTransition] = useState(false);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});
    const listRef = useRef<HTMLUListElement | null>(null);

    const updateHighlightPosition = useCallback((itemId: string) => {
        const itemElement = itemRefs.current[itemId];
        const listElement = listRef.current;

        if (!itemElement || !listElement) return;

        const listRect = listElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();
        const relativeTop = itemRect.top - listRect.top;

        setHighlightPosition(prev => {
            if (prev.y === relativeTop && prev.height === itemRect.height) {
                return prev;
            }
            return {y: relativeTop, height: itemRect.height};
        });
    }, []);

    // Initialize transition animation
    useLayoutEffect(() => {
        updateHighlightPosition(activeItem);
        if (!showTransition) {
            requestAnimationFrame(() => setShowTransition(true));
        }
    }, [activeItem, updateHighlightPosition, showTransition]);

    // Handle window resize
    useEffect(() => {
        const handleResize = (): void => updateHighlightPosition(activeItem);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeItem, updateHighlightPosition]);

    // Update highlight position after collapse/expand animation (190ms delay)
    useEffect(() => {
        const timeoutId = setTimeout(() => updateHighlightPosition(activeItem), 190);
        return () => clearTimeout(timeoutId);
    }, [collapsed, activeItem, updateHighlightPosition]);

    return {
        highlightPosition,
        showTransition,
        itemRefs,
        listRef,
        updateHighlightPosition,
    };
};
