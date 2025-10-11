import {useEffect, useMemo, useState} from 'react';
import type {JoyColours} from '../../../shared/types/ui.types';

export interface RecipeSummary {
    id: string;
    name: string;
    description: string;
    link: string;
    tags: { tagName: string; color: JoyColours }[];
}

export function useRecipes() {
    const [recipes, setRecipes] = useState<RecipeSummary[]>([]);

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

    useEffect(() => {
        setRecipes(sampleRecipes);
    }, [sampleRecipes]);

    const deleteRecipe = (recipeId: string) => {
        setRecipes(prev => prev.filter(r => r.id !== recipeId));
    };

    return {
        recipes,
        deleteRecipe
    };
}

