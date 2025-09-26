import {useState} from 'react';
import {Autocomplete, Box, Button, Input, Sheet, Tooltip} from '@mui/joy';
import Stack from '@mui/joy/Stack';
import {CheckRounded, CloseRounded, DeleteRounded} from '@mui/icons-material';
import ActionButton from '../ui_components/ActionButton.tsx';
import RecipeBox from "./RecipeBox.tsx";

// Types
interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    measure: string;
    type?: 'regular' | 'equal-amounts-group';
    subItems?: string[];
}

type NewIngredient = Omit<Ingredient, 'id'>;

interface IngredientFormProps {
    onConfirm: (ingredient: NewIngredient) => void;
    onCancel: () => void;
    measurementUnits: string[];
    editingIngredient?: Ingredient;
    shouldApplyMargin?: boolean;
    onDelete?: () => void;
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
    const hasName = Boolean(name.trim());
    const hasQuantity = Boolean(quantity.trim());
    const hasMeasure = Boolean(measure.trim());

    // Must have name
    if (!hasName) return false;

    // If no quantity and no measure, it's valid (ingredient only)
    if (!hasQuantity && !hasMeasure) return true;

    // If either quantity or measure is provided, both must be provided and quantity must be valid
    if (hasQuantity || hasMeasure) {
        return hasQuantity && hasMeasure && isValidQuantity(quantity);
    }

    return false;
};

// Components
function IngredientForm({
                            onConfirm,
                            onCancel,
                            measurementUnits,
                            editingIngredient,
                            shouldApplyMargin,
                            onDelete
                        }: IngredientFormProps) {
    const [name, setName] = useState(editingIngredient?.name || '');
    const [quantity, setQuantity] = useState(editingIngredient?.quantity || '');
    const [measure, setMeasure] = useState(editingIngredient?.measure || '');

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
                mt: shouldApplyMargin ? 2 : 0
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
                    icon={editingIngredient ? <CloseRounded/> : <DeleteRounded/>}
                    onClick={handleCancel}
                    style={{width: '30px', height: '25px'}}
                />
                {editingIngredient && onDelete && (
                    <ActionButton
                        color="danger"
                        icon={<DeleteRounded/>}
                        onClick={onDelete}
                        style={{width: '30px', height: '25px'}}
                    />
                )}
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
                    freeSolo
                    variant="outlined"
                    size="sm"
                    color="warning"
                    placeholder="Measure"
                    value={measure}
                    onInputChange={(_, newInputValue) => setMeasure(newInputValue || '')}
                    options={measurementUnits}
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
    onEdit: () => void;
}

function IngredientItem({
                            ingredient,
                            isHovered,
                            onMouseEnter,
                            onMouseLeave,
                            onEdit
                        }: IngredientItemProps) {
    const itemStyle = {
        textDecoration: isHovered ? 'underline' : 'none',
        transition: 'all 0.2s ease',
    };

    const hasMeasurement = ingredient.quantity.trim() && ingredient.measure.trim();

    return (
        <Tooltip title="Click to edit" followCursor>
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onEdit}
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
                    {ingredient.type === 'equal-amounts-group' ? 'Equal amounts of:' : ingredient.name}
                </li>
                {hasMeasurement && ingredient.type !== 'equal-amounts-group' && (
                    <ul style={{ marginLeft: '20px'}}>
                        <li style={{ ...itemStyle, fontSize: '0.9em' }}>
                            {formatMeasure(ingredient.quantity, ingredient.measure)}
                        </li>
                    </ul>
                )}
                {ingredient.type === 'equal-amounts-group' && ingredient.subItems && (
                    <ul style={{marginLeft: '20px'}}>
                        {ingredient.subItems.map((item, index) => (
                            <li key={index} style={{...itemStyle, fontSize: '0.9em'}}>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </Box>
        </Tooltip>
    );
}

interface EqualAmountFormProps {
    onConfirm: (items: string[]) => void;
    onCancel: () => void;
    shouldApplyMargin?: boolean;
    editingIngredient?: Ingredient;
    onDelete?: () => void;
}

function EqualAmountForm({onConfirm, onCancel, shouldApplyMargin, editingIngredient, onDelete}: EqualAmountFormProps) {
    const [items, setItems] = useState<string[]>(() => {
        // Initialize with existing subItems if editing, otherwise default to empty array
        if (editingIngredient?.subItems && editingIngredient.subItems.length > 0) {
            return editingIngredient.subItems;
        }
        return ['', ''];
    });

    const addItem = () => {
        setItems(prev => [...prev, '']);
    };

    const updateItem = (index: number, value: string) => {
        setItems(prev => prev.map((item, i) => i === index ? value : item));
    };

    const handleConfirm = () => {
        const validItems = items.filter(item => item.trim() !== '');
        if (validItems.length >= 2) {
            onConfirm(validItems);
            setItems(['', '']);
        }
    };

    const handleCancel = () => {
        setItems(['', '']);
        onCancel();
    };

    const handleDelete = () => {
        if (editingIngredient && onDelete) {
            onDelete();
        }
    };

    const isFormValid = items.filter(item => item.trim() !== '').length >= 2;

    return (
        <Sheet
            sx={{
                backgroundColor: 'transparent',
                mt: shouldApplyMargin ? 2 : 0
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{display: 'flex', alignItems: 'flex-start'}}
            >
                <Stack direction="column" spacing={1} sx={{flex: 1}}>
                    {items.map((item, index) => (
                        <Input
                            key={index}
                            variant="outlined"
                            color="warning"
                            placeholder="Ingredient"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            sx={{flex: 1}}
                        />
                    ))}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="warning"
                            size="sm"
                            onClick={addItem}
                            sx={{
                                borderStyle: 'dashed',
                                alignSelf: 'flex-start'
                            }}
                        >
                            Add Ingredient
                        </Button>
                        <ActionButton
                            color="success"
                            icon={<CheckRounded/>}
                            onClick={handleConfirm}
                            disabled={!isFormValid}
                            style={{width: '30px', height: '25px'}}
                        />
                        <ActionButton
                            color="danger"
                            icon={editingIngredient ? <CloseRounded/> : <DeleteRounded/>}
                            onClick={handleCancel}
                            style={{width: '30px', height: '25px'}}
                        />
                        {editingIngredient && (
                            <ActionButton
                                color="danger"
                                icon={<DeleteRounded/>}
                                onClick={handleDelete}
                                style={{width: '30px', height: '25px'}}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Sheet>
    );
}

function RecipeIngredientCreate() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'regular' | 'equal-amounts'>('regular');
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<string[]>([
        'cup', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'liter',
        'gallon', 'quart', 'pint', 'piece', 'pieces', 'slice', 'slices', 'clove',
        'cloves', 'bunch', 'can', 'jar', 'bottle', 'package', 'bag', 'box'
    ]);

    // Add a helper to add a measurement unit if not present
    const addMeasurementUnit = (unit: string) => {
        if (unit && !measurementUnits.includes(unit)) {
            setMeasurementUnits(prev => [...prev, unit]);
        }
    };

    const handleAddIngredient = (newIngredient: NewIngredient) => {
        // Always add the measure if not present
        addMeasurementUnit(newIngredient.measure);

        if (editingIngredient) {
            // Update existing ingredient
            setIngredients(prev => prev.map(ingredient =>
                ingredient.id === editingIngredient.id
                    ? {...newIngredient, id: editingIngredient.id}
                    : ingredient
            ));
            setEditingIngredient(null);
        } else {
            // Add new ingredient
            const ingredient: Ingredient = {
                ...newIngredient,
                id: Date.now().toString()
            };
            setIngredients(prev => [...prev, ingredient]);
        }
        setShowForm(false);
    };

    const handleEditIngredient = (ingredient: Ingredient) => {
        setEditingIngredient(ingredient);
        setShowForm(true);
        // Set form type based on ingredient type
        setFormType(ingredient.type === 'equal-amounts-group' ? 'equal-amounts' : 'regular');
    };

    const handleCancelForm = () => {
        setEditingIngredient(null);
        setShowForm(false);
        setFormType('regular');
    };

    const handleEqualAmountsConfirm = (items: string[]) => {
        const ingredient: Ingredient = {
            id: Date.now().toString(),
            name: '',
            quantity: '',
            measure: '',
            type: 'equal-amounts-group',
            subItems: items
        };
        setIngredients(prev => [...prev, ingredient]);
        setShowForm(false);
        setFormType('regular');
    };

    const handleShowRegularForm = () => {
        setFormType('regular');
        setShowForm(true);
    };

    const handleShowEqualAmountsForm = () => {
        setFormType('equal-amounts');
        setShowForm(true);
    };

    const handleDeleteIngredient = (ingredientId: string) => {
        setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId));
        setEditingIngredient(null);
        setShowForm(false);
        setFormType('regular');
    };

    const hasIngredients = ingredients.length > 0;
    // Don't apply margin for inline editing (when editingIngredient exists)
    const shouldApplyMargin = !editingIngredient && hasIngredients;

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
                        editingIngredient && editingIngredient.id === ingredient.id ? (
                            <li key={ingredient.id}>
                                {editingIngredient.type === 'equal-amounts-group' ? (
                                    <EqualAmountForm
                                        onConfirm={(items) => {
                                            const updatedIngredient: Ingredient = {
                                                ...editingIngredient,
                                                subItems: items
                                            };
                                            setIngredients(prev => prev.map(ing =>
                                                ing.id === editingIngredient.id ? updatedIngredient : ing
                                            ));
                                            setEditingIngredient(null);
                                            setShowForm(false);
                                        }}
                                        onCancel={handleCancelForm}
                                        editingIngredient={editingIngredient}
                                        onDelete={() => handleDeleteIngredient(editingIngredient.id)}
                                    />
                                ) : (
                                    <IngredientForm
                                        onConfirm={handleAddIngredient}
                                        onCancel={handleCancelForm}
                                        measurementUnits={measurementUnits}
                                        editingIngredient={editingIngredient}
                                        onDelete={() => handleDeleteIngredient(editingIngredient.id)}
                                    />
                                )}
                            </li>
                        ) : (
                            <IngredientItem
                                key={ingredient.id}
                                ingredient={ingredient}
                                isHovered={hoveredIngredient === ingredient.id}
                                onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                                onMouseLeave={() => setHoveredIngredient(null)}
                                onEdit={() => handleEditIngredient(ingredient)}
                            />
                        )
                    ))}
                </ul>
            </Box>

            {!editingIngredient && (
                showForm ? (
                    formType === 'regular' ? (
                        <IngredientForm
                            onConfirm={handleAddIngredient}
                            onCancel={handleCancelForm}
                            measurementUnits={measurementUnits}
                            shouldApplyMargin={shouldApplyMargin}
                        />
                    ) : (
                        <EqualAmountForm
                            onConfirm={handleEqualAmountsConfirm}
                            onCancel={handleCancelForm}
                            shouldApplyMargin={shouldApplyMargin}
                        />
                    )
                ) : (
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            mt: shouldApplyMargin ? 2 : 0
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            size="md"
                            onClick={handleShowRegularForm}
                            sx={{
                                borderStyle: 'dashed'
                            }}
                        >
                            Add Ingredient
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="md"
                            onClick={handleShowEqualAmountsForm}
                            sx={{
                                borderStyle: 'dashed'
                            }}
                        >
                            Add Equal Amounts Of...
                        </Button>
                    </Stack>
                )
            )}
        </RecipeBox>
    );
}

export default RecipeIngredientCreate;
