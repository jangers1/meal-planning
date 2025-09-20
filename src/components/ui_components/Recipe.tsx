import {Box, Chip} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ServingSelector from "./ServingSelector.tsx";

const recipeTags = [
    {tag: "Vegetarian", color: "rgba(0, 128, 0, 0.7)"},
    {tag: "Gluten-Free", color: "rgba(255, 165, 0, 0.7)"},
    {tag: "Quick & Easy", color: "rgba(30, 144, 255, 0.7)"},
    {tag: "Dessert", color: "rgba(255, 20, 147, 0.7)"},
]

function Recipe() {
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        mt: 2,
                    }}>
                        {recipeTags.map(({tag, color}) => (
                            <Chip
                                key={tag}
                                variant="soft"
                                size="sm"
                                sx={{
                                    px: 2,
                                    backgroundColor: color,
                                    color: 'white'
                                }}
                            >
                                {tag}
                            </Chip>
                        ))}
                    </Box>
                </Box>
                <ServingSelector/>
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