import {Sheet, Stack} from "@mui/joy";
import RecipeHeaderInput from "../recipes/components/create/RecipeHeaderInput.tsx";
import RecipeIngredientCreate from "../recipes/components/create/RecipeIngredientCreate.tsx";
import RichTextField from "../recipes/components/create/RichTextField.tsx";
import RecipeBox from "../recipes/components/shared/RecipeBox.tsx";
import ActionButton from "../../shared/components/ui/ActionButton.tsx";
import Box from "@mui/joy/Box";
import {CheckRounded, CloseRounded} from "@mui/icons-material";

interface RecipeCreateProps {
    onSave?: () => void;
    onCancel?: () => void;
    isClosing?: boolean;
}

function RecipeCreate({onSave, onCancel, isClosing}: RecipeCreateProps) {
    const handleSave = () => {
        console.log('Save Recipe');
        onSave?.();
    };

    const handleCancel = () => {
        console.log('Cancel Recipe Creation');
        onCancel?.();
    };

    return (
        <Sheet
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: '1200px',
                height: '90vh',
                bgcolor: 'background.surface',
                borderRadius: 'md',
                boxShadow: 'lg',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: isClosing
                    ? 'modalSlideOut 400ms cubic-bezier(0.36, 0, 0.66, -0.56) forwards'
                    : 'modalSlideIn 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                '@keyframes modalSlideIn': {
                    '0%': {
                        opacity: 0,
                        transform: 'translate(-50%, -45%) scale(0.9)',
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translate(-50%, -50%) scale(1)',
                    },
                },
                '@keyframes modalSlideOut': {
                    '0%': {
                        opacity: 1,
                        transform: 'translate(-50%, -50%) scale(1)',
                    },
                    '100%': {
                        opacity: 0,
                        transform: 'translate(-50%, -55%) scale(0.9)',
                    },
                },
            }}
        >
            <Stack
                direction={'column'}
                spacing={4}
                sx={{
                    display: "flex",
                    flex: 1,
                    overflowY: 'auto',
                    pr: 1,
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
                    justifyContent: 'flex-end',
                    gap: 2,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                }}
            >
                <ActionButton
                    color="danger"
                    variant={'outlined'}
                    icon={<CloseRounded sx={{fontSize: '20px'}}/>}
                    onClick={handleCancel}
                    style={{
                        height: '50px',
                        padding: '0 15px',
                    }}
                />
                <ActionButton
                    color="success"
                    variant={'solid'}
                    icon={<CheckRounded sx={{fontSize: '20px'}}/>}
                    onClick={handleSave}
                    style={{
                        height: '50px',
                        padding: '0 15px',
                    }}
                />
            </Box>
        </Sheet>
    )
}

export default RecipeCreate;