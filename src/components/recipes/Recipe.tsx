import {Box, Chip, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ServingSelector from "./ServingSelector.tsx";
import NameDisplay from "./NameDisplay.tsx";
import {useState} from "react";
import type {JoyColours} from "../../types.ts";

function Recipe() {
    const [recipeOwner] = useState<string>(("Roshan"));
    const [recipeTags] = useState<{ tag: string, color: JoyColours }[]>([
        {tag: 'Vegetarian', color: 'primary'},
        {tag: 'Gluten-Free', color: 'warning'},
        {tag: 'Dessert', color: 'success'}
    ]);

    return (
        <>
            {/*Recipe Header*/}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 2,
                justifyContent: 'space-between',
            }}>
                <Box>
                    <Typography level="h1">
                        Recipe Title
                    </Typography>
                    <Typography level="body-sm">
                        Main Category | Sub Category 1 | Sub Category 2
                    </Typography>
                    <Stack direction="row" spacing={1} mt={2}>
                        {recipeTags.map(({tag, color}) => (
                            <Chip
                                key={tag}
                                variant="soft"
                                size="sm"
                                color= {color}
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
                    <ServingSelector/>
                </Box>
            </Box>

            {/*Recipe Ingredients*/}
            <Box sx={{
                borderRadius: 'var(--border-radius)',
                backgroundColor: 'var(--primary-color)',
                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                minHeight: '20%',
                maxHeight: '40%',
                mt: 1,
                mx: 2
            }}>

            </Box>

            {/*Recipe Instructions*/}
            <Box sx={{
                borderRadius: 'var(--border-radius)',
                backgroundColor: 'var(--primary-color)',
                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                minHeight: '40%',
                mt: 5,
                mx: 2
            }}>

            </Box>
        </>
    )
}

export default Recipe;