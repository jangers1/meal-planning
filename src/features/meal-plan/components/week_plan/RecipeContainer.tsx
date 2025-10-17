import {Box, Divider, IconButton, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {DeletableItem, DeleteModeProvider} from "../../../../shared/components/ui/DeleteModeProvider.tsx";
import {useDeleteMode} from "../../../../shared/hooks/useDeleteMode.ts";
import type {GenericRecipe, PreppedMeal, Recipe} from "../../types/recipe.types";
import DraggableRecipeCard from "./DraggableRecipeCard";
import {RecipeContainerSkeleton} from "./RecipeContainerSkeleton";
import {useMemo} from "react";

interface RecipeContainerProps {
    genericRecipes: GenericRecipe[];
    prepedMeals: PreppedMeal[];
    recipes: Recipe[];
    isLoading: boolean;
    onDeleteGeneric?: (id: number) => void;
    getRecipeUsageCount: (recipeId: number) => number;
}

function RecipeContainer({genericRecipes, prepedMeals, recipes, isLoading, onDeleteGeneric, getRecipeUsageCount}: RecipeContainerProps) {
    if (isLoading) {
        return <RecipeContainerSkeleton count={8} />;
    }

    return (
        <DeleteModeProvider>
            <RecipeContainerInner
                genericRecipes={genericRecipes}
                prepedMeals={prepedMeals}
                recipes={recipes}
                onDeleteGeneric={onDeleteGeneric}
                getRecipeUsageCount={getRecipeUsageCount}
            />
        </DeleteModeProvider>
    );
}

// Inner component that uses the delete mode hook
function RecipeContainerInner({genericRecipes, prepedMeals, recipes, onDeleteGeneric, getRecipeUsageCount}: Omit<RecipeContainerProps, 'isLoading'>) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    const handleEditClick = () => {
        setDeleteMode(!isDeleteMode);
    };

    // Sort recipes by usage count (most used first)
    const sortedGenericRecipes = useMemo(() => {
        return [...genericRecipes].sort((a, b) => {
            return getRecipeUsageCount(b.id) - getRecipeUsageCount(a.id);
        });
    }, [genericRecipes, getRecipeUsageCount]);

    const sortedPrepedMeals = useMemo(() => {
        return [...prepedMeals].sort((a, b) => {
            return getRecipeUsageCount(b.id) - getRecipeUsageCount(a.id);
        });
    }, [prepedMeals, getRecipeUsageCount]);

    const sortedRecipes = useMemo(() => {
        return [...recipes].sort((a, b) => {
            return getRecipeUsageCount(b.id) - getRecipeUsageCount(a.id);
        });
    }, [recipes, getRecipeUsageCount]);

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
                        {sortedGenericRecipes.length > 0 ? (
                            sortedGenericRecipes.map(recipe => (
                                <DeletableItem
                                    key={recipe.id}
                                    itemId={recipe.id}
                                    onDelete={() => onDeleteGeneric?.(recipe.id)}
                                    deleteButtonPosition='top-left'
                                >
                                    <DraggableRecipeCard
                                        recipe={recipe}
                                        usageCount={getRecipeUsageCount(recipe.id)}
                                    />
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
                        ) : null}
                    </Box>
                </>
            )}

            {/* Prepped Meals Section */}
            {prepedMeals.length > 0 && (
                <>
                    <Typography level={'h2'}>
                        Prepped Meals
                    </Typography>
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
                        }}
                    >
                        {sortedPrepedMeals.map(meal => (
                            <DraggableRecipeCard
                                key={meal.id}
                                recipe={meal}
                                usageCount={getRecipeUsageCount(meal.id)}
                            />
                        ))}
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
                {sortedRecipes.length > 0 ? (
                    sortedRecipes.map(recipe => (
                        <DraggableRecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            usageCount={getRecipeUsageCount(recipe.id)}
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
                        No recipes available.
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default RecipeContainer;
