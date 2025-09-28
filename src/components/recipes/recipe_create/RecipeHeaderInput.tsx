import {useState} from 'react';
import {Box, Button, IconButton, Input, Textarea} from "@mui/joy"; // added Button
import ChipManager from "./ChipManager.tsx";
import {type ChipData} from "./ChipCreateForm.tsx";
import Stack from "@mui/joy/Stack";
import {CloseRounded} from "@mui/icons-material";
import ServingSelector from "./ServingSelector.tsx";

function RecipeHeaderInput() {
    const [recipeTags, setRecipeTags] = useState<ChipData[]>([]);
    const [availableTags, setAvailableTags] = useState<ChipData[]>([
        // Some default tags to start with
        {text: 'Quick', color: 'success'},
        {text: 'Vegetarian', color: 'primary'},
        {text: 'Spicy', color: 'danger'},
        {text: 'Healthy', color: 'success'},
        {text: 'Comfort Food', color: 'warning'},
        {text: 'Holiday', color: 'primary'},
        {text: 'Budget-Friendly', color: 'neutral'}
    ]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleNewTagCreated = (newTag: ChipData) => {
        // Add the new tag to available tags if it doesn't already exist
        if (!availableTags.some(tag => tag.text === newTag.text)) {
            setAvailableTags(prev => [...prev, newTag]);
        }
    };

    return (
        <>
            <Stack
                direction={'column'}
                spacing={2}
            >
                <Stack
                    direction={'row'}
                    spacing={2}
                >
                    <Input
                        placeholder={'Enter Recipe Title'}
                        variant={title ? "soft" : "outlined"}
                        size="lg"
                        color={'primary'}
                        sx={{
                            flex: 1
                        }}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        endDecorator={
                            <IconButton
                                variant={'plain'}
                                color={'primary'}
                                onClick={() => {
                                    setTitle('')
                                }}
                            >
                                <CloseRounded/>
                            </IconButton>
                        }
                    />
                </Stack>

                <Stack
                    direction={'row'}
                    spacing={2}
                >
                    {/* Description textarea with overlaid Clear button */}
                    <Box sx={{position: 'relative', flex: 1}}>
                        <Textarea
                            placeholder="Enter recipe description..."
                            size='sm'
                            minRows={2}
                            maxRows={2}
                            variant={description ? "soft" : "outlined"}
                            color="primary"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            sx={{
                                width: '100%',
                                // Add extra padding at bottom/right so text doesn't run under the Clear button
                                '& textarea': {
                                    paddingRight: '4.5rem',
                                    paddingBottom: '2.25rem'
                                }
                            }}
                        />
                        {description && (
                            <Button
                                aria-label="Clear description"
                                onClick={() => setDescription('')}
                                size="sm"
                                variant="plain"
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    bottom: 6,
                                    right: 6,
                                    px: 1.25,
                                    py: 0.25,
                                    fontSize: 'xs',
                                    lineHeight: 1.1,
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </Box>
                </Stack>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <ChipManager
                        chips={recipeTags}
                        onChipsChange={setRecipeTags}
                        availableTags={availableTags}
                        onNewTagCreated={handleNewTagCreated}
                    />
                    <ServingSelector/>
                </Box>
            </Stack>
        </>
    )
}

export default RecipeHeaderInput;