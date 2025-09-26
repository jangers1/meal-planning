import { Box, Button } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import RecipeBox from './RecipeBox';
import { IngredientForm } from './components/IngredientForm';
import { IngredientItem } from './components/IngredientItem';
import { EqualAmountForm } from './components/EqualAmountForm';
import { useIngredientManager } from './hooks/useIngredientManager';

function RecipeIngredientCreate() {
    const {
        ingredients,
        showForm,
        formType,
        hoveredIngredient,
        editingIngredient,
        measurementUnits,
        handleAddIngredient,
        handleEditIngredient,
        handleCancelForm,
        handleEqualAmountsConfirm,
        handleDeleteIngredient,
        showRegularForm,
        showEqualAmountsForm,
        setHoveredIngredient,
    } = useIngredientManager();

    const hasIngredients = ingredients.length > 0;
    const shouldApplyMargin = !editingIngredient && hasIngredients;

    const renderIngredientsList = () => (
        <Box sx={{ px: 2, '& .measure': { ml: 3 } }}>
            <ul>
                {ingredients.map((ingredient) => (
                    editingIngredient && editingIngredient.id === ingredient.id ? (
                        <li key={ingredient.id}>
                            {editingIngredient.type === 'equal-amounts-group' ? (
                                <EqualAmountForm
                                    onConfirm={handleEqualAmountsConfirm}
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
    );

    const renderAddButtons = () => (
        <Stack
            direction="row"
            spacing={2}
            sx={{ mt: shouldApplyMargin ? 2 : 0 }}
        >
            <Button
                variant="outlined"
                color="primary"
                size="md"
                onClick={showRegularForm}
                sx={{ borderStyle: 'dashed' }}
            >
                Add Ingredient
            </Button>
            <Button
                variant="outlined"
                color="primary"
                size="md"
                onClick={showEqualAmountsForm}
                sx={{ borderStyle: 'dashed' }}
            >
                Add Equal Amounts Of...
            </Button>
        </Stack>
    );

    const renderForms = () => {
        if (formType === 'regular') {
            return (
                <IngredientForm
                    onConfirm={handleAddIngredient}
                    onCancel={handleCancelForm}
                    measurementUnits={measurementUnits}
                    shouldApplyMargin={shouldApplyMargin}
                />
            );
        }

        return (
            <EqualAmountForm
                onConfirm={handleEqualAmountsConfirm}
                onCancel={handleCancelForm}
                shouldApplyMargin={shouldApplyMargin}
            />
        );
    };

    return (
        <RecipeBox title="Ingredients">
            {renderIngredientsList()}

            {!editingIngredient && (
                showForm ? renderForms() : renderAddButtons()
            )}
        </RecipeBox>
    );
}

export default RecipeIngredientCreate;
