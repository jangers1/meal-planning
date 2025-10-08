import {DragOverlay as DndKitDragOverlay, useDndContext} from '@dnd-kit/core';
import {dropAnimationConfig} from '../config';
import '../styles.css';
import React from "react";

export interface DragOverlayProps {
    children: React.ReactNode;
    className?: string;
    width?: number;
    height?: number;
}

/**
 * Reusable drag overlay component
 * Shows a visual representation of the dragged item that follows the cursor
 * Handles drop animations automatically
 */
export function DragOverlay({children, className = '', width, height}: DragOverlayProps) {
    const overlayClasses = ['dnd-overlay-wrapper', className].filter(Boolean).join(' ');
    const {activeNodeRect} = useDndContext();

    const effectiveWidth = typeof width === 'number' ? width : (activeNodeRect?.width ?? undefined);
    const effectiveHeight = typeof height === 'number' ? height : (activeNodeRect?.height ?? undefined);

    if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[DND] overlay size', {width: effectiveWidth, height: effectiveHeight});
    }

    const sizeStyle: React.CSSProperties = {
        width: typeof effectiveWidth === 'number' ? `${effectiveWidth}px` : undefined,
        height: typeof effectiveHeight === 'number' ? `${effectiveHeight}px` : undefined,
        minWidth: typeof effectiveWidth === 'number' ? `${effectiveWidth}px` : undefined,
        minHeight: typeof effectiveHeight === 'number' ? `${effectiveHeight}px` : undefined,
    };

    return (
        <DndKitDragOverlay dropAnimation={dropAnimationConfig} adjustScale={false}>
            {children ? (
                <div className={overlayClasses}>
                    <div className="dnd-overlay-element" style={sizeStyle}>
                        {children}
                    </div>
                </div>
            ) : null}
        </DndKitDragOverlay>
    );
}
