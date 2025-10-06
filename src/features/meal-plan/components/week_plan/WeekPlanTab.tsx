import WeekPlan from './WeekPlan';
import WeekPlanToolbar from './WeekPlanToolbar';
import RecipeContainer from './RecipeContainer';
import FloatingActionButtons from './FloatingActionButtons';
import CreateGenericRecipeDialog from './CreateGenericRecipeDialog';
import {useCallback, useState} from 'react';
import type {GenericRecipe, Recipe} from '../../types/recipe.types';

interface WeekPlanTabProps {
    genericRecipes: GenericRecipe[];
    recipes: Recipe[];
    onCreateGeneric: (name: string) => void;
    onDeleteGeneric: (id: number) => void;
}

export default function WeekPlanTab({
    genericRecipes,
    recipes,
    onCreateGeneric,
    onDeleteGeneric,
}: WeekPlanTabProps) {
    const [includeWeekend, setIncludeWeekend] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const handleCreateGenericClick = useCallback(() => {
        setShowCreateDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setShowCreateDialog(false);
    }, []);

    const handleCreateGeneric = useCallback(
        (name: string) => {
            onCreateGeneric(name);
        },
        [onCreateGeneric]
    );

    const handleExportShoppingList = useCallback(() => {
        console.log('Shopping List Exported');
        // TODO: Implement export logic
    }, []);

    const handleSave = useCallback(() => {
        console.log('Meal Plan Saved');
        // TODO: Implement save logic
    }, []);

    const defaultRecipeName = `Generic Recipe ${genericRecipes.length + 1}`;

    return (
        <>
            <WeekPlan includeWeekend={includeWeekend} />

            <WeekPlanToolbar
                includeWeekend={includeWeekend}
                onToggleWeekend={setIncludeWeekend}
                onCreateGeneric={handleCreateGenericClick}
            />

            <RecipeContainer
                genericRecipes={genericRecipes}
                recipes={recipes}
                onDeleteGeneric={onDeleteGeneric}
            />

            <FloatingActionButtons
                onExportShoppingList={handleExportShoppingList}
                onSave={handleSave}
            />

            <CreateGenericRecipeDialog
                open={showCreateDialog}
                onClose={handleCloseDialog}
                onCreate={handleCreateGeneric}
                defaultName={defaultRecipeName}
            />
        </>
    );
}

