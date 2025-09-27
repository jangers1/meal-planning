import {Box, Typography} from "@mui/joy";
import React from "react";
import {type SxProps} from "@mui/system";

interface RecipeBoxProps {
    children: React.ReactNode
    title?: string
    style?: SxProps
}

function RecipeBox({children, title, style}: RecipeBoxProps) {
    return (
        <>
            <Box
                sx={{
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                    p: 2,
                    ...style
                }}
            >
                <Typography level="h3" sx={{pb: 2}}>
                    {title}
                </Typography>
                {children}
            </Box>
        </>
    )
}

export default RecipeBox;