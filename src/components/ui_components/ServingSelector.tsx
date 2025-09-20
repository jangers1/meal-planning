import React, {useState} from 'react';
import {Box, IconButton, Typography} from '@mui/joy';
import {Add, Remove} from '@mui/icons-material';

interface ServingSelectorProps {
    initialServings?: number;
    onServingsChange?: (servings: number) => void;
}

const ServingSelector: React.FC<ServingSelectorProps> = ({
                                                             initialServings = 2,
                                                             onServingsChange
                                                         }) => {
    const [servings, setServings] = useState(initialServings);

    const handleIncrease = () => {
        const newServings = servings + 1;
        setServings(newServings);
        onServingsChange?.(newServings);
    };

    const handleDecrease = () => {
        const newServings = servings - 1;
        setServings(newServings);
        onServingsChange?.(newServings);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    padding: 1,
                    width: 'min-content'
                }}
            >
                <Typography level="body" sx={{
                    minWidth: '80px',
                    textAlign: 'center'
                }}>
                    Serves: {servings}
                </Typography>

                <IconButton
                    variant="soft"
                    size="sm"
                    onClick={handleDecrease}
                    disabled={servings <= 1}
                    sx={{minWidth: '24px', minHeight: '24px'}}
                >
                    <Remove/>
                </IconButton>

                <IconButton
                    variant="soft"
                    size="sm"
                    onClick={handleIncrease}
                    sx={{minWidth: '24px', minHeight: '24px'}}
                >
                    <Add/>
                </IconButton>
            </Box>
        </>
    );
};

export default ServingSelector;
