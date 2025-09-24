import {useState} from 'react';
import {Autocomplete, Box, Button, Input, Sheet, Tooltip} from '@mui/joy';
import Stack from '@mui/joy/Stack';
import {CheckRounded, CloseRounded} from '@mui/icons-material';
import ActionButton from '../ui_components/ActionButton.tsx';
import RecipeBox from "./RecipeBox.tsx";

// Constants
const MEASUREMENT_UNITS = [
    'tsp', 'tbsp', 'cup', 'ml', 'l', 'g', 'kg', 'oz', 'lb',
    'pinch', 'dash', 'clove', 'slice', 'piece'
] as const;

// Types
interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    measure: string;
}

type NewIngredient = Omit<Ingredient, 'id'>;

interface IngredientFormProps {
    onConfirm: (ingredient: NewIngredient) => void;
    onCancel: () => void;
    ingredients: Ingredient[];
}

// Helper functions
const isValidQuantity = (quantity: string): boolean => {
    const trimmed = quantity.trim();
    if (!trimmed) return false;
    const num = Number(trimmed);
    return !isNaN(num) && num > 0;
};

const formatMeasure = (quantity: string, measure: string): string => {
    if (quantity && measure) return `${quantity} ${measure}`;
    return quantity || measure || '';
};

const isFormValid = (name: string, quantity: string, measure: string): boolean => {
    return Boolean(
        name.trim() &&
        quantity.trim() &&
        measure.trim() &&
        isValidQuantity(quantity)
    );
};

// Components
function IngredientForm({onConfirm, onCancel, ingredients}: IngredientFormProps) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [measure, setMeasure] = useState('');

    const resetForm = () => {
        setName('');
        setQuantity('');
        setMeasure('');
    };

    const handleConfirm = () => {
        if (isFormValid(name, quantity, measure)) {
            onConfirm({
                name: name.trim(),
                quantity: quantity.trim(),
                measure: measure.trim()
            });
            resetForm();
        }
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const isQuantityInputValid = quantity.trim() === '' || isValidQuantity(quantity);
    const isFormComplete = isFormValid(name, quantity, measure);

    return (
        <Sheet
            sx={{
                backgroundColor: 'transparent',
                mt: ingredients.length > 0 ? 2 : 0
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{display: 'flex', alignItems: 'center'}}
            >
                <Input
                    variant="outlined"
                    color="warning"
                    placeholder="Ingredient"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{flex: 1}}
                />
                <ActionButton
                    color="success"
                    icon={<CheckRounded/>}
                    onClick={handleConfirm}
                    disabled={!isFormComplete}
                    style={{width: '30px', height: '25px'}}
                />
                <ActionButton
                    color="danger"
                    icon={<CloseRounded/>}
                    onClick={handleCancel}
                    style={{width: '30px', height: '25px'}}
                />
            </Stack>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    ml: 3,
                    mt: 1
                }}
            >
                <Input
                    variant="outlined"
                    size="sm"
                    color={isQuantityInputValid ? 'warning' : 'danger'}
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    sx={{
                        width: '75px',
                        '& input': {textAlign: 'center'}
                    }}
                />
                <Autocomplete
                    variant="outlined"
                    size="sm"
                    color="warning"
                    placeholder="Measure"
                    value={measure}
                    onChange={(_, newValue) => setMeasure(newValue || '')}
                    options={MEASUREMENT_UNITS}
                    sx={{
                        width: '300px'
                    }}
                />
            </Box>
        </Sheet>
    );
}

interface IngredientItemProps {
    ingredient: Ingredient;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onDelete: () => void;
}

function IngredientItem({
                            ingredient,
                            isHovered,
                            onMouseEnter,
                            onMouseLeave,
                            onDelete
                        }: IngredientItemProps) {
    const itemStyle = {
        textDecoration: isHovered ? 'line-through' : 'none',
        transition: 'all 0.2s ease',
    };

    return (
        <Tooltip title="Click to remove" followCursor>
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onDelete}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    mx: -3,
                    pl: 3,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }
                }}
            >
                <li className="ingredient" style={itemStyle}>
                    {ingredient.name}
                </li>
                <li className="measure" style={itemStyle}>
                    {formatMeasure(ingredient.quantity, ingredient.measure)}
                </li>
            </Box>
        </Tooltip>
    );
}

function RecipeIngredientCreate() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);

    const handleAddIngredient = (newIngredient: NewIngredient) => {
        const ingredient: Ingredient = {
            ...newIngredient,
            id: Date.now().toString()
        };
        setIngredients(prev => [...prev, ingredient]);
        setShowForm(false);
    };

    const handleDeleteIngredient = (id: string) => {
        setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
    };

    const hasIngredients = ingredients.length > 0;

    return (
        <RecipeBox
            title={'Ingredients'}
        >
            <Box sx={{
                px: 2,
                '& .measure': {ml: 3}
            }}>
                <ul>
                    {ingredients.map((ingredient) => (
                        <IngredientItem
                            key={ingredient.id}
                            ingredient={ingredient}
                            isHovered={hoveredIngredient === ingredient.id}
                            onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                            onMouseLeave={() => setHoveredIngredient(null)}
                            onDelete={() => handleDeleteIngredient(ingredient.id)}
                        />
                    ))}
                </ul>
            </Box>

            {showForm ? (
                <IngredientForm
                    onConfirm={handleAddIngredient}
                    onCancel={() => setShowForm(false)}
                    ingredients={ingredients}
                />
            ) : (
                <Button
                    variant="outlined"
                    color="primary"
                    size="md"
                    onClick={() => setShowForm(true)}
                    sx={{
                        borderStyle: 'dashed',
                        mt: hasIngredients ? 2 : 0
                    }}
                >
                    Add Ingredient
                </Button>
            )}
        </RecipeBox>
    );
}

export default RecipeIngredientCreate;
