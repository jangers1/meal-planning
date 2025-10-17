import React, {useState} from 'react';
import {Box, IconButton, Typography} from '@mui/joy';
import {Add, Remove} from '@mui/icons-material';

interface ButtonedSelectorProps {
    startingValue: number;
    setterFunc: (value: number) => void;
    acceptZero: boolean;
    decoratorText?: string;
}

function ButtonedSelector({startingValue, setterFunc, acceptZero, decoratorText}: ButtonedSelectorProps) {
    const [value, setValue] = useState(startingValue);

    const handleIncrease = () => {
        setterFunc(value + 1);
        setValue(value + 1);
    };

    const handleDecrease = () => {
        let newValue;
        if (acceptZero) {
            newValue = value > 0 ? value - 1 : 0;
        } else {
            newValue = value > 1 ? value - 1 : 1;
        }
        setValue(newValue);
        setterFunc(newValue);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    m: 1,
                    width: 'min-content'
                }}
            >
                <Typography level={'body-md'} sx={{
                    minWidth: '80px',
                    textAlign: 'center'
                }}>
                    {decoratorText} {}
                </Typography>

                <IconButton
                    variant="soft"
                    size="sm"
                    onClick={handleDecrease}
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

export default ButtonedSelector;
