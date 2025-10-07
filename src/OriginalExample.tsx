import {useCallback, useState} from 'react';
import type {DragEndEvent, DragPendingEvent, DropAnimation} from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useDndMonitor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import './OriginalExample.css';

// Constants
const DRAG_DELAY_MS = 500;
const DRAG_TOLERANCE_PX = 5;
const DROP_ANIMATION_DURATION_MS = 600;

// Drop animation configuration for smooth scale-down and shadow fade
const dropAnimationConfig: DropAnimation = {
    keyframes({transform}) {
        return [
            {transform: CSS.Transform.toString(transform.initial)},
            {
                transform: CSS.Transform.toString({
                    ...transform.final,
                    scaleX: 0.94,
                    scaleY: 0.94,
                }),
            },
        ];
    },
    sideEffects({active, dragOverlay}) {
        active.node.style.opacity = '0';

        const button = dragOverlay.node.querySelector('button');
        if (button) {
            button.animate(
                [
                    {
                        boxShadow:
                            '-1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)',
                    },
                    {
                        boxShadow:
                            '-1px 0 15px 0 rgba(34, 33, 81, 0), 0px 15px 15px 0 rgba(34, 33, 81, 0)',
                    },
                ],
                {
                    duration: DROP_ANIMATION_DURATION_MS,
                    easing: 'ease',
                    fill: 'forwards',
                }
            );
        }

        return () => {
            active.node.style.opacity = '';
        };
    },
};

// Draggable Item Component
function Draggable({id}: { id: string }) {
    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({id});

    const [isPending, setIsPending] = useState(false);
    const [pendingDelayMs, setPendingDelay] = useState(0);

    const handlePending = useCallback((event: DragPendingEvent) => {
        setIsPending(true);
        const {constraint} = event;
        if ('delay' in constraint) {
            setPendingDelay(constraint.delay);
        }
    }, []);

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
    const buttonStyle = isPendingWithDelay ? {animationDuration: `${pendingDelayMs}ms`} : undefined;
    const wrapperClassName = `draggable-wrapper ${isDragging ? 'dragging' : ''} ${isPendingWithDelay ? 'pending-delay' : ''}`.trim();

    return (
        <div ref={setNodeRef} className={wrapperClassName}>
            <button
                className="draggable-button"
                style={buttonStyle}
                {...listeners}
                {...attributes}
            >
                {id}
            </button>
        </div>
    );
}

// Droppable Container Component
function Droppable({id, children}: { id: string; children: React.ReactNode }) {
    const {setNodeRef, isOver} = useDroppable({id});

    return (
        <div ref={setNodeRef} className={`droppable-container ${isOver ? 'over' : ''}`}>
            {children}
        </div>
    );
}

// Drag Overlay Component
function DraggableOverlay({activeId}: { activeId: string | null }) {
    return (
        <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId ? (
                <div className="draggable-overlay-wrapper">
                    <button className="draggable-overlay">{activeId}</button>
                </div>
            ) : null}
        </DragOverlay>
    );
}

// Main Demo Component
export default function OriginalExample() {
    const [parent, setParent] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const containers = ['A', 'B', 'C'];

    const handleDragStart = useCallback(({active}: { active: { id: string | number } }) => {
        setActiveId(active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {over} = event;
        setParent(over ? (over.id as string) : null);
        setActiveId(null);
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    // Configure sensor with activation delay based on parent state
    const activationConstraint = parent !== null ? {delay: DRAG_DELAY_MS, tolerance: DRAG_TOLERANCE_PX} : undefined;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint,
        })
    );

    return (
        <div style={{padding: '40px', fontFamily: 'system-ui, sans-serif'}}>
            <h1>Original Working Example</h1>
            <p>Drag the button between containers A, B, and C</p>
            {parent !== null && (
                <p style={{fontSize: '14px', color: '#666'}}>
                    Hold for {DRAG_DELAY_MS}ms to drag out of container
                </p>
            )}

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div style={{marginBottom: '20px'}}>
                    {parent === null && <Draggable id="draggable"/>}
                </div>

                <div>
                    {containers.map((id) => (
                        <Droppable key={id} id={id}>
                            <h3 style={{margin: '0 0 10px 0'}}>Container {id}</h3>
                            {parent === id && <Draggable id="draggable"/>}
                        </Droppable>
                    ))}
                </div>

                <DraggableOverlay activeId={activeId}/>
            </DndContext>
        </div>
    );
}
