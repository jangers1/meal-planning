import {Box, Divider, IconButton, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {DeletableItem, DeleteModeProvider} from "../../../../shared/components/ui/DeleteModeProvider.tsx";
import {useDeleteMode} from "../../../../shared/hooks/useDeleteMode.ts";
import type {GenericRecipe, Recipe} from "../../types/recipe.types";
import DraggableRecipeCard from "./DraggableRecipeCard";

interface RecipeContainerProps {
    genericRecipes: GenericRecipe[];
    recipes: Recipe[];
    onDeleteGeneric?: (id: number) => void;
    getSlotForRecipe: (recipeId: number) => string | undefined;
}

function RecipeContainer({genericRecipes, recipes, onDeleteGeneric, getSlotForRecipe}: RecipeContainerProps) {
    return (
        <DeleteModeProvider>
            <RecipeContainerInner
                genericRecipes={genericRecipes}
                recipes={recipes}
                onDeleteGeneric={onDeleteGeneric}
                getSlotForRecipe={getSlotForRecipe}
            />
        </DeleteModeProvider>
    );
}

// Inner component that uses the delete mode hook
function RecipeContainerInner({genericRecipes, recipes, onDeleteGeneric, getSlotForRecipe}: RecipeContainerProps) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    const handleEditClick = () => {
        setDeleteMode(!isDeleteMode);
    };

    // Filter out recipes that are currently in slots
    const availableGenericRecipes = genericRecipes.filter(recipe => !getSlotForRecipe(recipe.id));
    const availableRecipes = recipes.filter(recipe => !getSlotForRecipe(recipe.id));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: 'var(--primary-color)',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                mt: 2,
                p: 2,
            }}
        >
            {/* Generic Recipes Section */}
            {(genericRecipes.length > 0 || isDeleteMode) && (
                <>
                    <Stack
                        direction={'row'}
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <Typography level={'h2'}>
                            Generic
                        </Typography>
                        <IconButton
                            variant={'solid'}
                            color={isDeleteMode ? 'success' : 'warning'}
                            onClick={handleEditClick}
                            sx={{
                                minWidth: '18px',
                                height: '18px',
                                minHeight: '24px',
                            }}
                        >
                            {isDeleteMode ? (
                                <DoneIcon sx={{fontSize: '15px'}}/>
                            ) : (
                                <EditIcon sx={{fontSize: '15px'}}/>
                            )}
                        </IconButton>
                    </Stack>
                    <Divider/>
                    <Box
                        sx={{
                            mt: 1,
                            mb: 3,
                            display: 'grid',
                            gridAutoRows: 'minmax(60px, auto)',
                            // Match the slot width (day column minWidth is 150px)
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: 2,
                            alignContent: 'start',
                            minHeight: genericRecipes.length === 0 && isDeleteMode ? '60px' : 'auto'
                        }}
                    >
                        {availableGenericRecipes.length > 0 ? (
                            availableGenericRecipes.map(recipe => (
                                <DeletableItem
                                    key={recipe.id}
                                    itemId={recipe.id}
                                    onDelete={() => onDeleteGeneric?.(recipe.id)}
                                >
                                    <DraggableRecipeCard recipe={recipe}/>
                                </DeletableItem>
                            ))
                        ) : isDeleteMode ? (
                            <Box
                                sx={{
                                    gridColumn: '1 / -1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'text.tertiary',
                                    fontStyle: 'italic',
                                    minHeight: '60px'
                                }}
                            >
                                All generic recipes deleted. Click the checkmark to exit edit mode.
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    gridColumn: '1 / -1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'text.tertiary',
                                    fontStyle: 'italic',
                                    minHeight: '60px'
                                }}
                            >
                                All generic recipes are in use.
                            </Box>
                        )}
                    </Box>
                </>
            )}

            <Typography level={'h2'}>
                Recipes
            </Typography>
            <Divider/>
            <Box
                sx={{
                    mt: 1,
                    display: 'grid',
                    gridAutoRows: 'minmax(60px, auto)',
                    // Match the slot width (day column minWidth is 150px)
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 2
                }}
            >
                {availableRecipes.length > 0 ? (
                    availableRecipes.map(recipe => (
                        <DraggableRecipeCard
                            key={recipe.id}
                            recipe={recipe}
                        />
                    ))
                ) : (
                    <Box
                        sx={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.tertiary',
                            fontStyle: 'italic',
                            minHeight: '60px'
                        }}
                    >
                        All recipes are in use.
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default RecipeContainer;
