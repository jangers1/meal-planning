import React, {useCallback, useState} from 'react';
import type {DragPendingEvent} from '@dnd-kit/core';
import {useDndMonitor, useDraggable} from '@dnd-kit/core';
import '../styles.css';

export interface DraggableProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    isInSlot?: boolean;
}

export function Draggable({id, children, className = '', disabled = false, isInSlot = false}: DraggableProps) {
    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id,
        disabled,
        data: {isInSlot},
    });

    const [isPending, setIsPending] = useState(false);
    const [pendingDelayMs, setPendingDelay] = useState(0);

    const handlePending = useCallback((event: DragPendingEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const eventId = (event as any)?.active?.id || (event as any).id;

        if (eventId === id) {
            setIsPending(true);
            const {constraint} = event;
            if ('delay' in constraint) {
                setPendingDelay(constraint.delay);
            }
        }
    }, [id]);

    const handlePendingEnd = useCallback(() => {
        setIsPending(false);
        setPendingDelay(0);
    }, []);

    useDndMonitor({
        onDragPending: handlePending,
        onDragAbort: handlePendingEnd,
        onDragCancel: handlePendingEnd,
        onDragEnd: handlePendingEnd,
    });

    const isPendingWithDelay = isPending && pendingDelayMs > 0;
    const wrapperStyle = isPendingWithDelay
        ? {'--animation-duration': `${pendingDelayMs}ms`} as React.CSSProperties
        : undefined;
    const wrapperClassName = `dnd-draggable-wrapper ${isDragging ? 'dragging' : ''} ${isPendingWithDelay ? 'pending-delay' : ''} ${className}`.trim();

    return (
        <div
            ref={setNodeRef}
            className={wrapperClassName}
            style={wrapperStyle}
            data-draggable-element
            data-dnd-id={id}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
}