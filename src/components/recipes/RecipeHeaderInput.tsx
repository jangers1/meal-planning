import {useState} from 'react';
import {Box, Input} from "@mui/joy";
import ChipManager from "./ChipManager.tsx";
import {type ChipData} from "./ChipCreateForm.tsx";
import CategorySelection, {type CategoryItem} from "./CategorySelection.tsx";

function RecipeHeaderInput() {
    const [recipeTags, setRecipeTags] = useState<ChipData[]>([]);
    const RECIPE_CATEGORIES: CategoryItem[] = [
        {
            id: 'appetizers',
            name: 'Appetizers',
            subCategories: [
                {id: 'cold-apps', name: 'Cold Appetizers'},
                {id: 'hot-apps', name: 'Hot Appetizers'},
                {
                    id: 'dips',
                    name: 'Dips & Spreads',
                    subCategories: [
                        {id: 'cheese-dips', name: 'Cheese Dips'},
                        {
                            id: 'veggie-dips',
                            name: 'Vegetable Dips',
                            subCategories: [
                                {id: 'hummus', name: 'Hummus Varieties'},
                                {id: 'bean-dips', name: 'Bean Dips'}
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'main-courses',
            name: 'Main Courses',
            subCategories: [
                {
                    id: 'meat',
                    name: 'Meat Dishes',
                    subCategories: [
                        {
                            id: 'beef',
                            name: 'Beef',
                            subCategories: [
                                {id: 'steaks', name: 'Steaks'},
                                {id: 'roasts', name: 'Roasts'}
                            ]
                        },
                        {id: 'chicken', name: 'Chicken'},
                        {id: 'pork', name: 'Pork'}
                    ]
                },
                {id: 'seafood', name: 'Seafood'},
                {id: 'vegetarian', name: 'Vegetarian'}
            ]
        },
        {
            id: 'desserts',
            name: 'Desserts',
            subCategories: [
                {id: 'cakes', name: 'Cakes'},
                {id: 'cookies', name: 'Cookies'},
                {id: 'ice-cream', name: 'Ice Cream'}
            ]
        },
        {
            id: 'beverages',
            name: 'Beverages',
            subCategories: [
                {id: 'alcoholic', name: 'Alcoholic'},
                {id: 'non-alcoholic', name: 'Non-Alcoholic'}
            ]
        }
    ];

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                gap: 2
            }}>
                <Box>
                    <Input placeholder={'Enter Recipe Title'} variant="outlined" size="lg" color={'primary'}/>
                </Box>

                <Box>
                    <CategorySelection categories={RECIPE_CATEGORIES}/>
                </Box>

                <Box>
                    <ChipManager
                        chips={recipeTags}
                        onChipsChange={setRecipeTags}
                        placeholder="Enter Tag"
                        addButtonText="Add Tag"
                        variant="soft"
                        defaultColor="primary"
                        chipSize="lg"
                        buttonSize="sm"
                        inputSize="sm"
                    />
                </Box>
            </Box>
        </>
    )
}

export default RecipeHeaderInput;