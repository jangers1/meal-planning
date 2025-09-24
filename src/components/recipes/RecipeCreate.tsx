import {Stack} from "@mui/joy";
import RecipeHeaderInput from "./RecipeHeaderInput.tsx";
import RecipeIngredientCreate from "./RecipeIngredientCreate.tsx";
import RichTextField from "./RichTextField.tsx";
import RecipeBox from "./RecipeBox.tsx";
import ActionButton from "../ui_components/ActionButton.tsx";
import Box from "@mui/joy/Box";
import SvgIcon, {type SvgIconProps} from '@mui/material/SvgIcon';

function CheckIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </SvgIcon>
    );
}

function CloseIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </SvgIcon>
    );
}

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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    gap: 2
                }}
            >
                <ActionButton
                    color="success"
                    variant={'solid'}
                    icon={<CheckIcon sx={{fontSize: '20px'}}/>}
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
                    icon={<CloseIcon sx={{fontSize: '20px'}}/>}
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