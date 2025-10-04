import {Box, Divider, IconButton, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import RecipeCardPlan from "./RecipeCard.tsx";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {DeletableItem, DeleteModeProvider} from "../../../../shared/components/ui/DeleteModeProvider.tsx";
import {useDeleteMode} from "../../../../shared/hooks/useDeleteMode.ts";
import type { GenericRecipe, Recipe } from "../../types/recipe.types";

interface RecipeContainerProps {
    genericRecipes: GenericRecipe[];
    recipes: Recipe[];
    onDeleteGeneric?: (id: number) => void;
}

function RecipeContainer({ genericRecipes, recipes, onDeleteGeneric }: RecipeContainerProps) {
    return (
        <DeleteModeProvider>
            <RecipeContainerInner
                genericRecipes={genericRecipes}
                recipes={recipes}
                onDeleteGeneric={onDeleteGeneric}
            />
        </DeleteModeProvider>
    );
}

// Inner component that uses the delete mode hook
function RecipeContainerInner({ genericRecipes, recipes, onDeleteGeneric }: RecipeContainerProps) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    const handleEditClick = () => {
        setDeleteMode(!isDeleteMode);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: 'var(--primary-color)',
                borderRadius: 'var(--border-radius)',
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
                                <DoneIcon sx={{ fontSize: '15px' }} />
                            ) : (
                                <EditIcon sx={{ fontSize: '15px' }} />
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
                            gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
                            gap: 2,
                            alignContent: 'start',
                            minHeight: genericRecipes.length === 0 && isDeleteMode ? '60px' : 'auto'
                        }}
                    >
                        {genericRecipes.length > 0 ? (
                            genericRecipes.map(recipe => (
                                <DeletableItem
                                    key={recipe.id}
                                    itemId={recipe.id}
                                    onDelete={() => onDeleteGeneric?.(recipe.id)}
                                >
                                    <RecipeCardPlan title={recipe.title} />
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

            <Typography level={'h2'}>
                Recipes
            </Typography>
            <Divider/>
            <Box
                sx={{
                    mt: 1,
                    display: 'grid',
                    gridAutoRows: 'minmax(60px, auto)',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
                    gap: 2
                }}
            >
                {recipes.map(recipe => (
                    <RecipeCardPlan
                        key={recipe.id}
                        title={recipe.title}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default RecipeContainer;
