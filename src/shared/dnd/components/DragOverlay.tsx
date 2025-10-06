import {DragOverlay as DndKitDragOverlay} from '@dnd-kit/core';
import {dropAnimationConfig} from '../config';
import clsx from 'clsx';
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
 */
export function DragOverlay({children, className}: DragOverlayProps) {
    const overlayClassName = clsx('dnd-overlay-wrapper', className);

    return (
        <DndKitDragOverlay dropAnimation={dropAnimationConfig}>
            {children ? (
                <div className={overlayClassName}>
                    <div className="dnd-overlay-element" data-draggable-element>
                        {children}
                    </div>
                </div>
            ) : null}
        </DndKitDragOverlay>
    );
}

