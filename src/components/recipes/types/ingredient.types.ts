export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    measure: string;
    type?: 'regular' | 'equal-amounts-group';
    subItems?: string[];
}

export type NewIngredient = Omit<Ingredient, 'id'>;

export interface IngredientFormProps {
    onConfirm: (ingredient: NewIngredient) => void;
    onCancel: () => void;
    measurementUnits: string[];
    editingIngredient?: Ingredient;
    shouldApplyMargin?: boolean;
    onDelete?: () => void;
}

export interface EqualAmountFormProps {
    onConfirm: (items: string[]) => void;
    onCancel: () => void;
    shouldApplyMargin?: boolean;
    editingIngredient?: Ingredient;
    onDelete?: () => void;
}

export interface IngredientItemProps {
    ingredient: Ingredient;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onEdit: () => void;
}
