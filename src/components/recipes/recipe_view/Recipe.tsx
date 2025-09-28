import {Box, Chip, Stack, Typography} from "@mui/joy";
import ServingSelector from "../recipe_create/ServingSelector.tsx";
import NameDisplay from "./NameDisplay.tsx";
import {useState} from "react";
import type {JoyColours} from "../../../types.ts";
import RecipeBox from "../recipe_create/RecipeBox.tsx";
import ActionButton from "../../ui_components/ActionButton.tsx";
import EditIcon from '@mui/icons-material/Edit';

function Recipe() {
    const [recipeOwner] = useState<string>(("Roshan"));
    const [recipeTags] = useState<{ tag: string, color: JoyColours }[]>([
        {tag: 'Vegetarian', color: 'primary'},
        {tag: 'Gluten-Free', color: 'warning'},
        {tag: 'Dessert', color: 'success'}
    ]);
    const [servings] = useState<number>(2);
    const [recipeTitle] = useState<string>('Recipe Title');
    const [recipeDescription] = useState<string>('Recipe Description');

    return (
        <>
            {/*Recipe Header*/}
            <Stack
                direction={'column'}
                spacing={4}
                sx={{
                    display: "flex",
                    flex: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography level="h1">
                            {recipeTitle}
                        </Typography>
                        <Typography level="body-lg">
                            {recipeDescription}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={2}>
                            {recipeTags.map(({tag, color}) => (
                                <Chip
                                    key={tag}
                                    variant="soft"
                                    size="sm"
                                    color={color}
                                    sx={{
                                        px: 2,
                                        pb: 0.5
                                    }}
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between'
                        }}
                    >
                        <NameDisplay name={recipeOwner}/>
                        <ServingSelector initialServings={servings}/>
                    </Box>
                </Box>

                {/*Recipe Ingredients*/}
                <RecipeBox
                    title={'Ingredients'}
                >
                    Placeholder
                </RecipeBox>

                {/*Recipe Instructions*/}
                <RecipeBox
                    title={'Instructions'}
                >
                    Placeholder
                </RecipeBox>
            </Stack>
            <ActionButton
                color="warning"
                variant={'solid'}
                icon={<EditIcon sx={{fontSize: '20px'}}/>}
                onClick={() => {
                    console.log('Save Recipe')
                }}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    height: '50px',
                    padding: '0 15px',
                    boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)'
                }}
            />
        </>
    )
}

export default Recipe;