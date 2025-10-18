import {useEffect, useState} from 'react';
import {Box, IconButton, Typography} from '@mui/joy';
import {Add, Remove} from '@mui/icons-material';

interface StringValue {
    id: number;
    name: string;
}

interface ButtonedSelectorProps {
    startingValue: number | string;
    setterFunc: (value: number) => void;
    acceptZero: boolean;
    decoratorText?: string;
    stringValues?: StringValue[];
}

function ButtonedSelector({
                              startingValue,
                              setterFunc,
                              acceptZero,
                              decoratorText = '',
                              stringValues
                          }: ButtonedSelectorProps) {
    const isStringMode = stringValues && stringValues.length > 0;

    // Calculate initial index based on mode
    let initialIndex: number;
    if (isStringMode) {
        // In string mode, find the index based on the startingValue
        if (typeof startingValue === 'string') {
            initialIndex = stringValues.findIndex(item => item.name === startingValue);
        } else {
            initialIndex = stringValues.findIndex(item => item.id === startingValue);
        }
        initialIndex = initialIndex >= 0 ? initialIndex : 0;
    } else {
        // In number mode, use startingValue directly as the index
        initialIndex = typeof startingValue === 'number' ? startingValue : 0;
    }

    const [index, setIndex] = useState(initialIndex);

    // Sync internal index when startingValue changes externally
    useEffect(() => {
        let newIndex: number;
        if (isStringMode) {
            if (typeof startingValue === 'string') {
                newIndex = stringValues.findIndex(item => item.name === startingValue);
            } else {
                newIndex = stringValues.findIndex(item => item.id === startingValue);
            }
            newIndex = newIndex >= 0 ? newIndex : 0;
        } else {
            newIndex = typeof startingValue === 'number' ? startingValue : 0;
        }
        setIndex(newIndex);
    }, [startingValue, isStringMode, stringValues]);

    const handleIncrease = () => {
        let newIndex;
        if (isStringMode) {
            newIndex = (index + 1) % stringValues.length;
        } else {
            newIndex = index + 1;
        }
        setIndex(newIndex);
        setterFunc(isStringMode ? stringValues[newIndex].id : newIndex);
    };

    const handleDecrease = () => {
        let newIndex;
        if (isStringMode) {
            newIndex = (index - 1 + stringValues.length) % stringValues.length;
        } else {
            if (acceptZero) {
                newIndex = index > 0 ? index - 1 : 0;
            } else {
                newIndex = index > 1 ? index - 1 : 1;
            }
        }
        setIndex(newIndex);
        setterFunc(isStringMode ? stringValues[newIndex].id : newIndex);
    };

    const displayValue = isStringMode ? stringValues[index].name : index;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                m: 1,
            }}
        >
            <Typography level={'body-md'} sx={{
                textAlign: 'center'
            }}>
                {decoratorText + displayValue}
            </Typography>

            <IconButton
                variant="solid"
                color="primary"
                size="sm"
                onClick={handleDecrease}
                sx={{minWidth: '24px', minHeight: '24px'}}
            >
                <Remove/>
            </IconButton>

            <IconButton
                variant="solid"
                color="primary"
                size="sm"
                onClick={handleIncrease}
                sx={{minWidth: '24px', minHeight: '24px'}}
            >
                <Add/>
            </IconButton>
        </Box>
    );
}

export default ButtonedSelector;
