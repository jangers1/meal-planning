import {PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {DRAG_DELAY_MS, DRAG_TOLERANCE_PX} from '../constants';

class SmartPointerSensor extends PointerSensor {
    static activators = PointerSensor.activators;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(props: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const draggableData = props.activeNode?.data?.current;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (draggableData?.isInSlot === true) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            props.options = {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ...props.options,
                activationConstraint: {
                    delay: DRAG_DELAY_MS,
                    tolerance: DRAG_TOLERANCE_PX,
                }
            };
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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