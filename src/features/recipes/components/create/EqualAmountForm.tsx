import { useState } from 'react';
import { Button, Input, Sheet } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import { CheckRounded, CloseRounded, DeleteRounded } from '@mui/icons-material';
import ActionButton from '../../../../shared/components/ui/ActionButton.tsx';
import type { EqualAmountFormProps } from '../../types/ingredient.types.ts';

export function EqualAmountForm({
    onConfirm,
    onCancel,
    shouldApplyMargin,
    editingIngredient,
    onDelete
}: EqualAmountFormProps) {
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
                sx={{ display: 'flex', alignItems: 'flex-start' }}
            >
                <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
                    {items.map((item, index) => (
                        <Input
                            key={index}
                            variant="outlined"
                            color="warning"
                            placeholder="Ingredient"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            sx={{ flex: 1 }}
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
                            icon={<CheckRounded />}
                            onClick={handleConfirm}
                            disabled={!isFormValid}
                            style={{ width: '30px', height: '25px' }}
                        />
                        <ActionButton
                            color="danger"
                            icon={editingIngredient ? <CloseRounded /> : <DeleteRounded />}
                            onClick={handleCancel}
                            style={{ width: '30px', height: '25px' }}
                        />
                        {editingIngredient && (
                            <ActionButton
                                color="danger"
                                icon={<DeleteRounded />}
                                onClick={handleDelete}
                                style={{ width: '30px', height: '25px' }}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Sheet>
    );
}
