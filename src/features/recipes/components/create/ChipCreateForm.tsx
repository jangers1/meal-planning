import React, {useState} from 'react';
import {Autocomplete, Box, Option, Select, useTheme} from '@mui/joy';
import {CheckRounded, CloseRounded} from '@mui/icons-material';
import type {JoyColours} from "../../../../shared/types/ui.types.ts";
import ActionButton from '../../../../shared/components/ui/ActionButton.tsx';

export interface ChipData {
    text: string;
    color: JoyColours;
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
    const [selectedColor, setSelectedColor] = useState<JoyColours>('primary');
    const theme = useTheme();

    const getColorFromTheme = (colorValue: JoyColours): string => {
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

    const CHIP_COLORS: readonly JoyColours[] = ['primary', 'neutral', 'danger', 'success', 'warning'] as const;

    const renderColorSelector = () => (
        <Select
            value={selectedColor}
            onChange={(_, newValue) => setSelectedColor((newValue || 'primary') as JoyColours)}
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
                        backgroundColor: getColorFromTheme((selected?.value as JoyColours) || 'primary'),
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                />
            )}
        >
            {CHIP_COLORS.map((colorValue) => (
                <Option key={colorValue} value={colorValue}>
                    <Box
                        sx={{
                            width: 60,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: getColorFromTheme(colorValue),
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    />
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

    return (
        <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1}}>
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

            <ActionButton
                color="success"
                icon={<CheckRounded/>}
                onClick={handleSave}
                disabled={!value.trim()}
            />
            <ActionButton
                color="danger"
                icon={<CloseRounded/>}
                onClick={handleCancel}
            />
        </Box>
    );
}

export default ChipCreateForm;
