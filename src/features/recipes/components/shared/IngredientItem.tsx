import { Box, Tooltip } from '@mui/joy';
import type { IngredientItemProps } from '../../types/ingredient.types';

// Utility function
const formatMeasure = (quantity: string, measure: string): string => {
    if (quantity && measure) return `${quantity} ${measure}`;
    return quantity || measure || '';
};

export function IngredientItem({
    ingredient,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onEdit
}: IngredientItemProps) {
    const itemStyle = {
        textDecoration: isHovered ? 'underline' : 'none',
        transition: 'all 0.2s ease',
    };

    const hasMeasurement = ingredient.quantity.trim() && ingredient.measure.trim();

    return (
        <Tooltip title="Click to edit" followCursor>
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onEdit}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    mx: -3,
                    pl: 3,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }
                }}
            >
                <li className="ingredient" style={itemStyle}>
                    {ingredient.type === 'equal-amounts-group' ? 'Equal amounts of:' : ingredient.name}
                </li>
                {hasMeasurement && ingredient.type !== 'equal-amounts-group' && (
                    <ul style={{ marginLeft: '20px' }}>
                        <li style={{ ...itemStyle, fontSize: '0.9em' }}>
                            {formatMeasure(ingredient.quantity, ingredient.measure)}
                        </li>
                    </ul>
                )}
                {ingredient.type === 'equal-amounts-group' && ingredient.subItems && (
                    <ul style={{ marginLeft: '20px' }}>
                        {ingredient.subItems.map((item, index) => (
                            <li key={index} style={{ ...itemStyle, fontSize: '0.9em' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </Box>
        </Tooltip>
    );
}
