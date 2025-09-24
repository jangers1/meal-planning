import {Stack} from "@mui/joy";
import RecipeHeaderInput from "./RecipeHeaderInput.tsx";
import RecipeIngredientCreate from "./RecipeIngredientCreate.tsx";
import RichTextField from "./RichTextField.tsx";
import RecipeBox from "./RecipeBox.tsx";

function RecipeCreate() {
    return (
        <>
            <Stack
                direction={'column'}
                spacing={4}
                sx={{
                    display: "flex",
                    m: 2,
                    flex: 1
                }}
            >
                <RecipeHeaderInput/>
                <RecipeIngredientCreate/>
                <RecipeBox
                    title={'Instructions'}
                    minHeight={'50%'}
                    maxHeight={'100%'}
                >
                    <RichTextField/>
                </RecipeBox>
            </Stack>
        </>
    )
}

export default RecipeCreate;