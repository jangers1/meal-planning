import {Box, Button, Divider, IconButton, Input, Select, Sheet, Switch, Typography} from "@mui/joy";
import Stack from "@mui/joy/Stack";
import {useEffect, useMemo, useRef, useState} from 'react';
import TuneIcon from '@mui/icons-material/TuneRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import RecipeCard from "../components/recipes/RecipeCard.tsx";
import type {JoyColours} from '../types.ts';

interface RecipeSummary {
    id: string;
    name: string;
    description: string;
    link: string;
    tags: { tagName: string; color: JoyColours }[];
}

function RecipeBank() {
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [searchMode, setSearchMode] = useState<'title' | 'tags'>('title');
    const drawerWidth = '20%'; // Width of the side panel
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const rafIdRef = useRef<number | null>(null);

    // --- Sample recipe data (placeholder until hooked to backend/store) ---
    const sampleRecipes: RecipeSummary[] = useMemo(() => ([
        {
            id: 'r1',
            name: 'Spicy Chickpea Curry',
            description: 'A bold, fragrant curry with tomatoes, coconut, and warming spices. High protein and perfect for batch cooking.',
            tags: [
                {tagName: 'Vegan', color: 'success'},
                {tagName: 'High Protein', color: 'warning'},
                {tagName: 'Dinner', color: 'primary'}
            ],
            link: '/recipes/spicy-chickpea-curry'
        },
        {
            id: 'r2',
            name: 'Classic Beef Lasagna',
            description: 'Layered pasta bake with rich beef ragù, herbed ricotta, and melted cheese—an ultimate comfort staple.',
            tags: [
                {tagName: 'Comfort', color: 'warning'},
                {tagName: 'Dinner', color: 'primary'}
            ],
            link: '/recipes/classic-beef-lasagna'
        },
        {
            id: 'r3',
            name: 'Green Goddess Smoothie',
            description: 'Bright and refreshing blend of spinach, avocado, citrus, and protein for a nourishing start to the day.',
            tags: [
                {tagName: 'Breakfast', color: 'success'},
                {tagName: 'Vegetarian', color: 'success'},
                {tagName: 'Low Calorie', color: 'primary'}
            ],
            link: '/recipes/green-goddess-smoothie'
        },
        {
            id: 'r4',
            name: 'Sheet Pan Lemon Salmon',
            description: 'Quick roasted salmon with zesty lemon, herbs, and tender vegetables—all on a single pan in under 25 minutes.',
            tags: [
                {tagName: 'Quick', color: 'warning'},
                {tagName: 'Dinner', color: 'primary'},
                {tagName: 'Omega-3', color: 'success'}
            ],
            link: '/recipes/sheet-pan-lemon-salmon'
        },
        {
            id: 'r5',
            name: 'Miso Ramen Bowl',
            description: 'Deep umami miso broth with chewy noodles, soft egg, and sautéed aromatics—customizable and cozy.',
            tags: [
                {tagName: 'Umami', color: 'primary'},
                {tagName: 'Comfort', color: 'warning'}
            ],
            link: '/recipes/miso-ramen-bowl'
        },
        {
            id: 'r6',
            name: 'Citrus Quinoa Salad',
            description: 'Light, tangy quinoa tossed with crisp veggies and citrus dressing—great for lunch prep or a side.',
            tags: [
                {tagName: 'Lunch', color: 'warning'},
                {tagName: 'Gluten-Free', color: 'danger'},
                {tagName: 'Light', color: 'neutral'}
            ],
            link: '/recipes/citrus-quinoa-salad'
        },
        {
            id: 'r7',
            name: 'Peanut Butter Overnight Oats',
            description: 'Creamy make-ahead oats with peanut butter and chia for a grab-and-go breakfast boost.',
            tags: [
                {tagName: 'Breakfast', color: 'success'},
                {tagName: 'Make-Ahead', color: 'neutral'}
            ],
            link: '/recipes/peanut-butter-overnight-oats'
        },
        {
            id: 'r8',
            name: 'Garlic Herb Roast Chicken',
            description: 'Juicy whole roast chicken infused with garlic, thyme, and rosemary—simple prep, big flavor.',
            tags: [
                {tagName: 'Family', color: 'primary'},
                {tagName: 'Dinner', color: 'primary'}
            ],
            link: '/recipes/garlic-herb-roast-chicken'
        },
        // --- Additional recipes for overflow testing ---
        {
            id: 'r9',
            name: 'Thai Basil Chicken Stir-Fry',
            description: 'Savory-sweet minced chicken with fresh basil and chilies—ready faster than takeout.',
            tags: [
                {tagName: 'Quick', color: 'warning'},
                {tagName: 'Dinner', color: 'primary'},
                {tagName: 'High Protein', color: 'warning'}
            ],
            link: '/recipes/thai-basil-chicken'
        },
        {
            id: 'r10',
            name: 'Roasted Vegetable Power Bowl',
            description: 'Sheet-pan roasted seasonal veggies over grains with a tangy herb yogurt drizzle.',
            tags: [
                {tagName: 'Lunch', color: 'warning'},
                {tagName: 'Vegetarian', color: 'success'},
                {tagName: 'Gluten-Free', color: 'danger'}
            ],
            link: '/recipes/roasted-veg-power-bowl'
        },
        {
            id: 'r11',
            name: 'Blueberry Protein Pancakes',
            description: 'Fluffy blended oat pancakes packed with protein and bursting blueberries.',
            tags: [
                {tagName: 'Breakfast', color: 'success'},
                {tagName: 'High Protein', color: 'warning'},
                {tagName: 'Make-Ahead', color: 'neutral'}
            ],
            link: '/recipes/blueberry-protein-pancakes'
        },
        {
            id: 'r12',
            name: 'Smoky Black Bean Tacos',
            description: 'Charred corn and spiced black beans with lime crunch slaw in warm tortillas.',
            tags: [
                {tagName: 'Vegan', color: 'success'},
                {tagName: 'Dinner', color: 'primary'},
                {tagName: 'High Fiber', color: 'success'}
            ],
            link: '/recipes/smoky-black-bean-tacos'
        },
        {
            id: 'r13',
            name: 'Butternut Squash Soup',
            description: 'Velvety roasted squash blended with aromatic herbs and a hint of nutmeg.',
            tags: [
                {tagName: 'Comfort', color: 'warning'},
                {tagName: 'Light', color: 'neutral'},
                {tagName: 'Vegetarian', color: 'success'}
            ],
            link: '/recipes/butternut-squash-soup'
        },
        {
            id: 'r14',
            name: 'Crispy Tofu Rice Bowls',
            description: 'Golden baked tofu, sesame veggies, and sticky sauce over steamed rice.',
            tags: [
                {tagName: 'Vegan', color: 'success'},
                {tagName: 'Lunch', color: 'warning'},
                {tagName: 'High Protein', color: 'warning'}
            ],
            link: '/recipes/crispy-tofu-rice-bowls'
        },
        {
            id: 'r15',
            name: 'Pesto Zucchini Noodles',
            description: 'Fresh basil pesto tossed with quick-sautéed spiral zucchini and toasted nuts.',
            tags: [
                {tagName: 'Low Calorie', color: 'primary'},
                {tagName: 'Quick', color: 'warning'},
                {tagName: 'Dinner', color: 'primary'}
            ],
            link: '/recipes/pesto-zucchini-noodles'
        },
        {
            id: 'r16',
            name: 'Mediterranean Chickpea Salad',
            description: 'Crunchy cucumber, olives, herbs, and chickpeas in a lemony olive oil dressing.',
            tags: [
                {tagName: 'Lunch', color: 'warning'},
                {tagName: 'Vegetarian', color: 'success'},
                {tagName: 'Light', color: 'neutral'}
            ],
            link: '/recipes/mediterranean-chickpea-salad'
        },
        {
            id: 'r17',
            name: 'One-Pot Chicken Orzo',
            description: 'Tender chicken and orzo simmered with garlic, lemon, and greens for an easy family dinner.',
            tags: [
                {tagName: 'Family', color: 'primary'},
                {tagName: 'Dinner', color: 'primary'},
                {tagName: 'Quick', color: 'warning'}
            ],
            link: '/recipes/one-pot-chicken-orzo'
        },
        {
            id: 'r18',
            name: 'Chocolate Avocado Mousse',
            description: 'Silky dark chocolate mousse sweetened naturally and blended with ripe avocado.',
            tags: [
                {tagName: 'Dessert', color: 'danger'},
                {tagName: 'Vegetarian', color: 'success'},
                {tagName: 'Low Calorie', color: 'primary'}
            ],
            link: '/recipes/chocolate-avocado-mousse'
        }
    ]), []);

    const filteredRecipes = useMemo(() => {
        const term = searchString.trim().toLowerCase();
        if (!term) return sampleRecipes;
        if (searchMode === 'title') {
            return sampleRecipes.filter(r => r.name.toLowerCase().includes(term));
        } else { // tags mode
            return sampleRecipes.filter(r => r.tags.some(t => t.tagName.toLowerCase().includes(term)));
        }
    }, [searchString, sampleRecipes, searchMode]);

    const updateShadows = () => {
        const el = scrollRef.current;
        if (!el) return;
        const {scrollTop, scrollHeight, clientHeight} = el;
        const top = scrollTop > 0;
        const bottom = scrollTop + clientHeight < scrollHeight - 1;
        setShowTopShadow(prev => prev !== top ? top : prev);
        setShowBottomShadow(prev => prev !== bottom ? bottom : prev);
    };

    const scheduleShadowUpdate = () => {
        if (rafIdRef.current != null) return; // already scheduled
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            updateShadows();
        });
    };

    // Recalculate shadows on window resize (layout changes)
    useEffect(() => {
        const handleResize = () => updateShadows();
        window.addEventListener('resize', handleResize);
        // Slight defer to allow layout to settle
        const id = requestAnimationFrame(updateShadows);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(id);
        };
    }, []);

    const handleScroll = () => scheduleShadowUpdate();

    // Compute accessibility status message
    const scrollStatusMessage = useMemo(() => {
        if (showTopShadow && showBottomShadow) return 'More content above and below';
        if (showTopShadow) return 'More content above';
        if (showBottomShadow) return 'More content below';
        return 'Start or end of list';
    }, [showTopShadow, showBottomShadow]);

    useEffect(() => {
        return () => {
            if (rafIdRef.current != null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

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
                {/*Main Page Content*/}
                <Stack
                    direction={'column'}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flex: 1,
                        transition: 'width 0.3s ease',
                        width: sidePanelOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
                        mr: sidePanelOpen ? 2 : 0
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Switch
                                variant={'outlined'}
                                size={'lg'}
                                checked={searchMode === 'tags'}
                                onChange={() => setSearchMode(prev => prev === 'title' ? 'tags' : 'title')}
                                slotProps={{ input: { 'aria-label': 'Toggle search mode: tags or titles' } }}
                            />
                        </Box>
                        <Input
                            placeholder={searchMode === 'tags' ? "Search tags..." : "Search recipe titles..."}
                            color="primary"
                            variant={searchString ? "soft" : "outlined"}
                            sx={{
                                flex: 1
                            }}
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                            endDecorator={
                                searchString && (
                                    <IconButton
                                        variant={'plain'}
                                        color={'primary'}
                                        onClick={() => setSearchString('')}
                                        aria-label="Clear search"
                                    >
                                        <CloseRounded/>
                                    </IconButton>
                                )
                            }
                        />
                        <Button
                            variant={'outlined'}
                            color={'primary'}
                            sx={{
                                borderStyle: 'dashed',
                            }}
                        >
                            Create Recipe
                        </Button>
                        <Button
                            variant="outlined"
                            color="neutral"
                            startDecorator={<TuneIcon/>}
                            onClick={() => setSidePanelOpen(prev => !prev)}
                        >
                            {sidePanelOpen ? 'Hide filters' : 'Change filters'}
                        </Button>
                    </Box>

                    {/* Scrollable Recipe Grid */}
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
                            onScroll={handleScroll}
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                p: 2,
                                overflowY: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gridAutoRows: '210px',
                                gap: 2,
                                borderRadius: 5
                            }}
                        >
                            {/* Live region for screen readers announcing scrollable status */}
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
                            {filteredRecipes.map(r => (
                                <RecipeCard key={r.id} name={r.name} tags={r.tags} link={r.link}
                                            description={r.description}/>
                            ))}
                            {!filteredRecipes.length && (
                                <Box>
                                    <Typography level="title-md">
                                        {searchMode === 'tags' ? 'No recipes found with that tag' : 'No recipes found with that title'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        {/*Top shadow (always rendered, fade via opacity)*/}
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
                        {/*Bottom shadow*/}
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
                    {/* End Scrollable Recipe Grid */}
                </Stack>

                {/*Side Panel for Filters*/}
                <Sheet
                    component="aside"
                    role="complementary"
                    aria-label="Recipe filters"
                    aria-hidden={!sidePanelOpen}
                    sx={{
                        width: sidePanelOpen ? drawerWidth : 0,
                        transition: 'width 0.3s ease',
                        overflow: 'hidden',
                        borderLeft: sidePanelOpen ? '1px solid' : 'none',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        p: sidePanelOpen ? (theme) => theme.spacing(2, 0, 2, 2) : 0,
                    }}
                >
                    {sidePanelOpen && (
                        <>
                            <Typography level="h2" textAlign={'center'}>Recipe Filters</Typography>
                            <Box>
                                <Typography level={'h4'}>Recipe Creator</Typography>
                                <Select
                                    sx={{
                                        mt: 1
                                    }}
                                >

                                </Select>
                            </Box>
                            <Box>
                                <Typography level={'h4'}>Tags</Typography>
                                <Stack
                                    direction={'column'}
                                    spacing={2}
                                    sx={{
                                        mt: 1
                                    }}
                                >
                                    {/*Selected Tags*/}
                                    <Box
                                        sx={{
                                            minHeight: '50px',
                                            borderRadius: 5,
                                            backgroundColor: 'var(--joy-palette-neutral-softBg)',
                                            p: 2
                                        }}
                                    >
                                        <Typography level={'body-sm'} sx={{opacity: 0.5}} textAlign={'center'}>
                                            Click on Tags below to select them. Recipes will begin to group themselves
                                            by
                                            selected tags
                                        </Typography>
                                    </Box>
                                    <Divider/>
                                    {/*Available Tags*/}
                                    <Box
                                        sx={{
                                            minHeight: '300px',
                                            borderRadius: 5,
                                            backgroundColor: 'var(--joy-palette-neutral-softBg)',
                                            p: 2
                                        }}
                                    >

                                    </Box>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Sheet>
            </Sheet>
        </>
    )
}

export default RecipeBank;
