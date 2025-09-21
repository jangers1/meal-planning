import { useState } from 'react';
import {Box, Input} from "@mui/joy";
import ChipManager from "./ChipManager.tsx";
import { type ChipData } from "./ChipCreateForm.tsx";

function RecipeHeaderInput() {
    const [recipeTags, setRecipeTags] = useState<ChipData[]>([
        { text: 'Salt', color: 'primary' },
        { text: 'Pepper', color: 'neutral' }
    ]);

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