import {Sheet} from "@mui/joy";
import Stack from "@mui/joy/Stack";
import {useMemo, useState} from 'react';
import {DeleteModeProvider} from "../../shared/components/ui/DeleteModeProvider.tsx";
import {useDeleteMode} from "../../shared/hooks/useDeleteMode.ts";
import {useRecipes} from "./hooks/useRecipes.ts";
import {useScrollShadows} from "./hooks/useScrollShadows.ts";
import {RecipeBankToolbar} from "./components/RecipeBankToolbar.tsx";
import {RecipeGrid} from "./components/RecipeGrid.tsx";
import {FilterPanel} from "./components/FilterPanel.tsx";
import {RecipeCreateModal} from "./components/RecipeCreateModal.tsx";

function RecipeBankContent() {
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [createRecipeOpen, setCreateRecipeOpen] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [searchMode, setSearchMode] = useState<'title' | 'tags'>('title');
    const drawerWidth = '20%';

    const {isDeleteMode, setDeleteMode} = useDeleteMode();
    const {recipes, deleteRecipe} = useRecipes();
    const {scrollRef, showTopShadow, showBottomShadow, scrollStatusMessage, handleScroll} = useScrollShadows();

    const filteredRecipes = useMemo(() => {
        const term = searchString.trim().toLowerCase();
        if (!term) return recipes;
        if (searchMode === 'title') {
            return recipes.filter(r => r.name.toLowerCase().includes(term));
        }
        return recipes.filter(r => r.tags.some(t => t.tagName.toLowerCase().includes(term)));
    }, [searchString, recipes, searchMode]);

    const emptyMessage = searchMode === 'tags'
        ? 'No recipes found with that tag'
        : 'No recipes found with that title';

    return (
        <>
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    width: '100%',
                    minHeight: 0
                }}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flex: 1,
                        transition: 'width 0.3s ease',
                        width: sidePanelOpen ? `calc(100% - ${drawerWidth})` : '100%',
                        mr: sidePanelOpen ? 2 : 0
                    }}
                >
                    <RecipeBankToolbar
                        searchMode={searchMode}
                        searchString={searchString}
                        sidePanelOpen={sidePanelOpen}
                        isDeleteMode={isDeleteMode}
                        onSearchModeChange={() => setSearchMode(prev => prev === 'title' ? 'tags' : 'title')}
                        onSearchChange={setSearchString}
                        onCreateRecipe={() => setCreateRecipeOpen(true)}
                        onToggleDeleteMode={() => setDeleteMode(!isDeleteMode)}
                        onToggleSidePanel={() => setSidePanelOpen(prev => !prev)}
                    />

                    <RecipeGrid
                        recipes={filteredRecipes}
                        scrollRef={scrollRef}
                        showTopShadow={showTopShadow}
                        showBottomShadow={showBottomShadow}
                        scrollStatusMessage={scrollStatusMessage}
                        onScroll={handleScroll}
                        onDeleteRecipe={deleteRecipe}
                        emptyMessage={emptyMessage}
                    />
                </Stack>

                <FilterPanel isOpen={sidePanelOpen} drawerWidth={drawerWidth}/>
            </Sheet>

            <RecipeCreateModal
                open={createRecipeOpen}
                onClose={() => setCreateRecipeOpen(false)}
            />
        </>
    );
}

function RecipeBank() {
    return (
        <DeleteModeProvider>
            <RecipeBankContent/>
        </DeleteModeProvider>
    );
}

export default RecipeBank;
