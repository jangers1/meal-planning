import React, {useState} from 'react';
import {Autocomplete, Box, Chip, Option, Select, useTheme} from '@mui/joy';
import {CheckRounded, CloseRounded} from '@mui/icons-material';

export type ChipColor = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

export interface ChipData {
    text: string;
    color: ChipColor;
}

interface ChipCreateFormProps {
    onSave: (chip: ChipData) => void;
    onCancel: () => void;
    availableTags?: ChipData[];
}

function ChipCreateForm({
                            onSave,
                            onCancel,
                            availableTags = []
                        }: ChipCreateFormProps) {
    const [value, setValue] = useState('');
    const [selectedColor, setSelectedColor] = useState<ChipColor>('primary');
    const theme = useTheme();

    const getColorFromTheme = (colorValue: ChipColor): string => {
        // Prefer Joy UI CSS vars for deterministic colors without unsafe casts
        const palette = theme.vars?.palette as Record<string, { solidBg?: string }> | undefined;
        return palette?.[colorValue]?.solidBg ?? theme.vars.palette.primary.solidBg;
    };

    const findExistingTag = (text: string): ChipData | undefined => {
        return availableTags.find(tag => tag.text === text);
    };

    const handleValueChange = (newValue: string | null) => {
        if (!newValue) {
            setValue('');
            return;
        }

        setValue(newValue);
        const existingTag = findExistingTag(newValue);
        if (existingTag) {
            setSelectedColor(existingTag.color);
        }
    };

    const handleAutocompleteChange = (
        _: React.SyntheticEvent,
        newValue: string | ChipData | null
    ) => {
        if (typeof newValue === 'string') {
            handleValueChange(newValue);
        } else if (newValue) {
            handleValueChange(newValue.text);
        }
    };

    const handleSave = () => {
        const trimmedValue = value.trim();
        if (trimmedValue) {
            onSave({text: trimmedValue, color: selectedColor});
            resetForm();
        }
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const resetForm = () => {
        setValue('');
        setSelectedColor('primary');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const CHIP_COLORS: readonly ChipColor[] = ['primary', 'neutral', 'danger', 'success', 'warning'] as const;

    const renderColorSelector = () => (
        <Select
            value={selectedColor}
            onChange={(_, newValue) => setSelectedColor((newValue || 'primary') as ChipColor)}
            size={'md'}
            sx={{
                minWidth: '40px',
                '& .MuiSelect-button': {
                    p: 0.5,
                    minHeight: 'auto'
                }
            }}
            renderValue={(selected) => (
                <Box
                    sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: getColorFromTheme((selected?.value as ChipColor) || 'primary'),
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                />
            )}
        >
            {CHIP_COLORS.map((colorValue) => (
                <Option key={colorValue} value={colorValue}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: getColorFromTheme(colorValue),
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        />
                        {colorValue.charAt(0).toUpperCase() + colorValue.slice(1)}
                    </Box>
                </Option>
            ))}
        </Select>
    );

    const renderAutocompleteOption = (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: string | ChipData
    ) => {
        const isString = typeof option === 'string';
        const text = isString ? option : option.text;
        const optionKey = isString ? option : option.text;

        return (
            <li {...props} key={optionKey}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {!isString && (
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: getColorFromTheme(option.color),
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        />
                    )}
                    {text}
                </Box>
            </li>
        );
    };

    const renderActionButton = (
        color: 'success' | 'danger',
        icon: React.ReactNode,
        onClick: () => void,
        disabled = false
    ) => (
        <Chip
            variant="outlined"
            color={color}
            size={'md'}
            onClick={onClick}
            disabled={disabled}
            sx={{cursor: 'pointer', minWidth: 'auto', px: 0.5}}
        >
            <Box sx={{fontSize: 16}}>
                {icon}
            </Box>
        </Chip>
    );

    return (
        <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}>
            {renderColorSelector()}

            <Autocomplete
                freeSolo
                options={availableTags}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.text}
                inputValue={value}
                onInputChange={(_, newInputValue) => setValue(newInputValue)}
                onChange={handleAutocompleteChange}
                renderOption={renderAutocompleteOption}
                size={'md'}
                placeholder={'Enter Tag'}
                onKeyDown={handleKeyDown}
                sx={{
                    minWidth: '120px',
                    maxHeight: '100px',
                    overflowY: 'auto'
                }}
            />

            {renderActionButton('success', <CheckRounded/>, handleSave, !value.trim())}
            {renderActionButton('danger', <CloseRounded/>, handleCancel)}
        </Box>
    );
}

export default ChipCreateForm;
