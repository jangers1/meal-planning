import {Stack} from "@mui/joy";
import RecipeHeaderInput from "./RecipeHeaderInput.tsx";
import RecipeIngredientCreate from "./RecipeIngredientCreate.tsx";

function RecipeCreate(){
    return (
        <>
            <Stack
                direction={'column'}
                spacing={4}
                sx={{
                    display: "flex",
                    m:2,
                    flex: 1
                }}
            >
                <RecipeHeaderInput/>
                <RecipeIngredientCreate/>
            </Stack>
        </>
    )
}

export default RecipeCreate;