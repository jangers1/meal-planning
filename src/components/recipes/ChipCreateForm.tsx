import React, {useEffect, useRef, useState} from 'react';
import {Box, Chip, Input, Option, Select} from '@mui/joy';
import {CheckRounded, CloseRounded} from '@mui/icons-material';

export interface ChipData {
    text: string;
    color: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
}

interface ChipCreateFormProps {
    onSave: (chip: ChipData) => void;
    onCancel: () => void;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
}

function ChipCreateForm({onSave, onCancel, placeholder = "Enter text", size = 'md'}: ChipCreateFormProps) {
    const [value, setValue] = useState('');
    const [selectedColor, setSelectedColor] = useState<'primary' | 'neutral' | 'danger' | 'success' | 'warning'>('primary');
    const inputRef = useRef<HTMLInputElement>(null);

    const colorOptions = [
        {value: 'primary', label: 'Blue', color: '#0B6BCB'},
        {value: 'neutral', label: 'Gray', color: '#555E68'},
        {value: 'danger', label: 'Red', color: '#C41E3A'},
        {value: 'success', label: 'Green', color: '#1F7A1F'},
        {value: 'warning', label: 'Orange', color: '#CC5500'}
    ];

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSave = () => {
        if (value.trim()) {
            onSave({text: value.trim(), color: selectedColor});
            setValue('');
            setSelectedColor('primary');
        }
    };

    const handleCancel = () => {
        setValue('');
        onCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}>
            <Select
                value={selectedColor}
                onChange={(_, newValue) => setSelectedColor(newValue as 'primary' | 'neutral' | 'danger' | 'success' | 'warning')}
                size={size}
                sx={{
                    minWidth: '40px',
                    '& .MuiSelect-button': {
                        p: 0.5,
                        minHeight: 'auto'
                    }
                }}
                renderValue={(selected) => {
                    const option = colorOptions.find(opt => opt.value === selected?.value);
                    return (
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: option?.color || '#0B6BCB',
                                border: '1px solid #ccc'
                            }}
                        />
                    );
                }}
            >
                {colorOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: option.color,
                                    border: '1px solid #ccc'
                                }}
                            />
                            {option.label}
                        </Box>
                    </Option>
                ))}
            </Select>
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                size={size}
                color={'primary'}
                sx={{
                    minWidth: '120px',
                    '& input': {
                        py: size === 'sm' ? 0.25 : size === 'md' ? 0.5 : 0.75
                    }
                }}
            />
            <Chip
                variant="outlined"
                color="success"
                size={size}
                onClick={handleSave}
                disabled={!value.trim()}
                sx={{cursor: 'pointer', minWidth: 'auto', px: 0.5}}
            >
                <CheckRounded sx={{fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18}}/>
            </Chip>
            <Chip
                variant="outlined"
                color="danger"
                size={size}
                onClick={handleCancel}
                sx={{cursor: 'pointer', minWidth: 'auto', px: 0.5}}
            >
                <CloseRounded sx={{fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18}}/>
            </Chip>
        </Box>
    );
}

export default ChipCreateForm;
