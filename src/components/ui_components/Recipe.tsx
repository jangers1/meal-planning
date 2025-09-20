import {Box} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import ServingSelector from "./ServingSelector.tsx";

function Recipe () {
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
                    <Typography level="body">
                        Main Category | Sub Category 1 | Sub Category 2
                    </Typography>
                </Box>
                <ServingSelector />
            </Box>

            {/*Recipe Ingredients*/}
            <Box sx={{
                borderRadius: 'var(--border-radius)',
                backgroundColor: 'var(--primary-color)',
                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                minHeight:'20%',
                maxHeight: '40%',
                mt: 2,
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