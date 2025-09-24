import { Box, Typography } from "@mui/joy";
import React from "react";

interface RecipeBoxProps {
    children: React.ReactNode
    title?: string
}

function RecipeBox({ children, title }: RecipeBoxProps) {
    return (
        <>
            <Box
                sx={{
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                    minHeight: '20%',
                    maxHeight: '40%',
                    p: 2
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