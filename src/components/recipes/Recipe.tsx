import {Box, Chip, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ServingSelector from "./ServingSelector.tsx";
import NameDisplay from "./NameDisplay.tsx";
import {useState} from "react";
import type {JoyColours} from "../../types.ts";
import RecipeBox from "./RecipeBox.tsx";

function Recipe() {
    const [recipeOwner] = useState<string>(("Roshan"));
    const [recipeTags] = useState<{ tag: string, color: JoyColours }[]>([
        {tag: 'Vegetarian', color: 'primary'},
        {tag: 'Gluten-Free', color: 'warning'},
        {tag: 'Dessert', color: 'success'}
    ]);
    const [servings] = useState<number>(2);
    const [categories] = useState<string[]>(['Main Category', 'Sub Category 1', 'Sub Category 2']);
    const [recipeTitle] = useState<string>('Recipe Title');

    return (
        <>
            {/*Recipe Header*/}
            <Stack
                direction={'column'}
                spacing={4}
                sx={{
                    display: "flex",
                    m: 2,
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
                        <Typography level="body-sm">
                            {categories.join(' | ')}
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
                    minHeight={'40%'}
                    maxHeight={'60%'}
                >
                    Placeholder
                </RecipeBox>
            </Stack>
        </>
    )
}

export default Recipe;