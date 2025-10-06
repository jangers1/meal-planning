// Meal plan constants
export const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const WEEKDAYS_ONLY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'] as const;

// Day and meal type types
export type Day = typeof ALL_DAYS[number];
export type WeekDay = typeof WEEKDAYS_ONLY[number];
export type MealType = typeof MEAL_TYPES[number];

// Meal slot identifier
export interface MealSlotId {
    day: Day | WeekDay;
    mealType: MealType;
}

// Helper function to create a unique slot ID string
export const createSlotId = (day: string, mealType: string): string => {
    return `${day}-${mealType}`;
};

// Helper function to parse a slot ID string
export const parseSlotId = (slotId: string): MealSlotId | null => {
    const [day, mealType] = slotId.split('-');
    if (day && mealType) {
        return {day: day as Day, mealType: mealType as MealType};
    }
    return null;
};

