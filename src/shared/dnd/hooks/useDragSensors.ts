import {PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {DRAG_DELAY_MS, DRAG_TOLERANCE_PX} from '../constants';

class SmartPointerSensor extends PointerSensor {
    static activators = PointerSensor.activators;

    constructor(props: any) {
        const draggableData = props.activeNode?.data?.current;

        if (draggableData?.isInSlot === true) {
            props.options = {
                ...props.options,
                activationConstraint: {
                    delay: DRAG_DELAY_MS,
                    tolerance: DRAG_TOLERANCE_PX,
                }
            };
        }

        super(props);
    }
}

export interface UseDragSensorsOptions {
    /**
     * Whether to use smart sensor (checks each item's isInSlot data)
     */
    useSmart?: boolean;
}

/**
 * Hook to create configured drag sensors
 * Uses SmartPointerSensor by default which checks each draggable's data
 */
export function useDragSensors({useSmart = true}: UseDragSensorsOptions = {}) {
    return useSensors(
        useSensor(useSmart ? SmartPointerSensor : PointerSensor)
    );
}