import {Box, Chip} from "@mui/joy";
import ServingSelector from "../recipes/components/view/ServingSelector.tsx";
import NameDisplay from "../recipes/components/view/NameDisplay.tsx";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import type {JoyColours} from "../../shared/types/ui.types.ts";
import RecipeBox from "../recipes/components/shared/RecipeBox.tsx";
import ActionButton from "../../shared/components/ui/ActionButton.tsx";
import {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import {DeleteRounded} from "@mui/icons-material";
import VersionControl from "../recipes/components/view/VersionControl.tsx";

function Recipe() {
    const [recipeOwner] = useState<string>(("Roshan"));
    const [recipeTags] = useState<{ tag: string, color: JoyColours }[]>([
        {tag: 'Vegetarian', color: 'primary'},
        {tag: 'Gluten-Free', color: 'warning'},
        {tag: 'Dessert', color: 'success'}
    ]);
    const [servings] = useState<number>(2);
    const [cookingTime] = useState<number>(45); // in minutes
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
                        <Box>
                            <NameDisplay name={recipeOwner}/>
                            <VersionControl/>
                        </Box>
                        <ServingSelector initialServings={servings}/>
                        <Typography level={'body-md'}>Cooking Time: {cookingTime} mins</Typography>
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    gap: 2
                }}
            >
                <ActionButton
                    color="warning"
                    variant={'solid'}
                    icon={<EditIcon sx={{fontSize: '20px'}}/>}
                    onClick={() => {
                        console.log('Save Recipe')
                    }}
                    style={{
                        height: '50px',
                        padding: '0 15px',
                        boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)'
                    }}
                />
                <ActionButton
                    color="danger"
                    variant={'solid'}
                    icon={<DeleteRounded sx={{fontSize: '20px'}}/>}
                    onClick={() => {
                        console.log('Save Recipe')
                    }}
                    style={{
                        height: '50px',
                        padding: '0 15px',
                        boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)'
                    }}
                />
            </Box>
        </>
    )
}

export default Recipe;