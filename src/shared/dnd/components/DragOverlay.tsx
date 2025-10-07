import {DragOverlay as DndKitDragOverlay} from '@dnd-kit/core';
import {dropAnimationConfig} from '../config';
import '../styles.css';

export interface DragOverlayProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable drag overlay component
 * Shows a visual representation of the dragged item that follows the cursor
 * Handles drop animations automatically
 */
export function DragOverlay({children, className = ''}: DragOverlayProps) {
    const overlayClasses = ['dnd-overlay-wrapper', className].filter(Boolean).join(' ');

    return (
        <DndKitDragOverlay dropAnimation={dropAnimationConfig}>
            {children ? (
                <div className={overlayClasses}>
                    <div className="dnd-overlay-element">
                        {children}
                    </div>
                </div>
            ) : null}
        </DndKitDragOverlay>
    );
}
