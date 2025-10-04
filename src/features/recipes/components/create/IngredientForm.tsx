import { useState } from 'react';
import { Autocomplete, Box, Input, Sheet } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import { CheckRounded, CloseRounded, DeleteRounded } from '@mui/icons-material';
import ActionButton from '../../../../shared/components/ui/ActionButton.tsx';
import type { IngredientFormProps } from '../../types/ingredient.types.ts';

// Utility functions
const isValidQuantity = (quantity: string): boolean => {
    const trimmed = quantity.trim();
    if (!trimmed) return false;
    const num = Number(trimmed);
    return !isNaN(num) && num > 0;
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

export function IngredientForm({
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
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <Input
                    variant="outlined"
                    color="warning"
                    placeholder="Ingredient"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <ActionButton
                    color="success"
                    icon={<CheckRounded />}
                    onClick={handleConfirm}
                    disabled={!isFormComplete}
                    style={{ width: '30px', height: '25px' }}
                />
                <ActionButton
                    color="danger"
                    icon={editingIngredient ? <CloseRounded /> : <DeleteRounded />}
                    onClick={handleCancel}
                    style={{ width: '30px', height: '25px' }}
                />
                {editingIngredient && onDelete && (
                    <ActionButton
                        color="danger"
                        icon={<DeleteRounded />}
                        onClick={onDelete}
                        style={{ width: '30px', height: '25px' }}
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
                        '& input': { textAlign: 'center' }
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
