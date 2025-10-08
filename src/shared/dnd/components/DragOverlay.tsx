import {DragOverlay as DndKitDragOverlay, useDndContext} from '@dnd-kit/core';
import {dropAnimationConfig} from '../config';
import '../styles.css';
import React from "react";

export interface DragOverlayProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable drag overlay component
 * Shows a visual representation of the dragged item that follows the cursor
 * Handles drop animations automatically
 * Size is automatically measured from the active node
 */
export function DragOverlay({children, className = ''}: DragOverlayProps) {
    const overlayClasses = ['dnd-overlay-wrapper', className].filter(Boolean).join(' ');
    const {activeNodeRect} = useDndContext();

    const sizeStyle: React.CSSProperties = {
        width: activeNodeRect?.width ? `${activeNodeRect.width}px` : undefined,
        height: activeNodeRect?.height ? `${activeNodeRect.height}px` : undefined,
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
