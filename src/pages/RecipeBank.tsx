import {Box, Button, Divider, IconButton, Input, Select, Sheet, Typography} from "@mui/joy";
import Stack from "@mui/joy/Stack";
import {useMemo, useState} from 'react';
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
    const drawerWidth = '20%'; // Width of the side panel

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
        return sampleRecipes.filter(r =>
            r.name.toLowerCase().includes(term) ||
            r.tags.some(t => t.tagName.toLowerCase().includes(term)) ||
            (r.description?.toLowerCase().includes(term) ?? false)
        );
    }, [searchString, sampleRecipes]);

    return (
        <>
            <Box
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
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography level={'h1'}>
                            Recipes
                        </Typography>
                        <Button
                            variant="outlined"
                            color="neutral"
                            startDecorator={<TuneIcon/>}
                            onClick={() => setSidePanelOpen(prev => !prev)}
                        >
                            {sidePanelOpen ? 'Hide filters' : 'Change filters'}
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                        }}
                    >
                        <Input
                            placeholder="Search recipes..."
                            color="primary"
                            variant={searchString ? "soft" : "outlined"}
                            sx={{
                                flex: 1
                            }}
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                            endDecorator={
                                <IconButton
                                    variant={'plain'}
                                    color={'primary'}
                                    onClick={() => setSearchString('')}
                                >
                                    <CloseRounded/>
                                </IconButton>
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
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            borderRadius: 5,
                            backgroundColor: 'var(--joy-palette-neutral-softBg)',
                            p: 2,
                            mt: 1,
                            boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gridAutoRows: '210px',
                            gap: 2,
                            overflowY: 'auto',
                        }}
                    >
                        {filteredRecipes.map(r => (
                            <RecipeCard key={r.id} name={r.name} tags={r.tags} link={r.link}
                                        description={r.description}/>
                        ))}
                        {!filteredRecipes.length && (
                            <Box>
                                <Typography level="title-md">No recipes match that search.</Typography>
                            </Box>
                        )}
                    </Box>
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
            </Box>
        </>
    )
}

export default RecipeBank;
