import {Box, Typography} from "@mui/joy";
import {DeletableItem} from "../../../shared/components/ui/DeleteModeProvider";
import RecipeCard from "../RecipeCard";
import type {RecipeSummary} from "../hooks/useRecipes";
import React from "react";

interface RecipeGridProps {
    recipes: RecipeSummary[];
    scrollRef: React.Ref<HTMLDivElement>;
    showTopShadow: boolean;
    showBottomShadow: boolean;
    scrollStatusMessage: string;
    onScroll: () => void;
    onDeleteRecipe: (id: string) => void;
    emptyMessage: string;
}

export function RecipeGrid({
    recipes,
    scrollRef,
    showTopShadow,
    showBottomShadow,
    scrollStatusMessage,
    onScroll,
    onDeleteRecipe,
    emptyMessage
}: RecipeGridProps) {
    return (
        <Box
            sx={{
                flex: 1,
                borderRadius: 5,
                backgroundColor: 'var(--joy-palette-neutral-softBg)',
                mt: 1,
                position: 'relative',
                boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}
            role="region"
            aria-label="Recipe results"
        >
            <Box
                ref={scrollRef}
                onScroll={onScroll}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    p: 2,
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gridAutoRows: '230px',
                    gap: 2,
                    borderRadius: 5
                }}
            >
                <Box
                    aria-live="polite"
                    aria-atomic="true"
                    sx={{
                        position: 'absolute',
                        width: 1,
                        height: 1,
                        margin: -1,
                        padding: 0,
                        border: 0,
                        overflow: 'hidden',
                        clip: 'rect(0 0 0 0)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {scrollStatusMessage}
                </Box>
                {recipes.map(r => (
                    <DeletableItem
                        key={r.id}
                        itemId={r.id}
                        onDelete={() => onDeleteRecipe(r.id)}
                        confirmMessage={`Are you sure you want to delete "${r.name}"?`}
                        deleteButtonPosition='top-right'
                    >
                        <RecipeCard
                            name={r.name}
                            tags={r.tags}
                            link={r.link}
                            description={r.description}
                        />
                    </DeletableItem>
                ))}
                {!recipes.length && (
                    <Box>
                        <Typography level="title-md">
                            {emptyMessage}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Top shadow */}
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 18,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0))',
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    zIndex: 2,
                    opacity: showTopShadow ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Bottom shadow */}
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 20,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0))',
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    zIndex: 2,
                    opacity: showBottomShadow ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />
        </Box>
    );
}
