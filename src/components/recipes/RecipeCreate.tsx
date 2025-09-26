import {Stack} from "@mui/joy";
import RecipeHeaderInput from "./RecipeHeaderInput.tsx";
import RecipeIngredientCreate from "./RecipeIngredientCreate.tsx";
import RichTextField from "./RichTextField.tsx";
import RecipeBox from "./RecipeBox.tsx";
import ActionButton from "../ui_components/ActionButton.tsx";
import Box from "@mui/joy/Box";
import {CheckRounded, CloseRounded} from "@mui/icons-material";

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
                >
                    <RichTextField/>
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
                    color="success"
                    variant={'solid'}
                    icon={<CheckRounded sx={{fontSize: '20px'}}/>}
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
                    icon={<CloseRounded sx={{fontSize: '20px'}}/>}
                    onClick={() => {
                        console.log('Cancel Recipe Creation')
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

export default RecipeCreate;