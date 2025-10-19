import {Box, Card, CardContent, Chip, Skeleton, Typography} from '@mui/joy';
import {useMemo, useState} from 'react';
import {useMasonryColumns, useMasonryPlacement} from './useMasonryPlacement';
import {DeletableItem} from '../../../shared/components/ui/DeleteModeProvider';
import './masonry.css';

export type PantryItem = {
    id: string;
    title: string;
    quantity: number; // used to determine tile size
    date: string | Date;
};

export type PantryMasonryProps = {
    items: PantryItem[];
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
    loading?: boolean;
    skeletonCount?: number;
    onDeleteItem?: (id: string) => void;
};

// Map quantity to tile size class. Tunable thresholds.
function quantityToTile(quantity: number): '1x1' | '2x1' | '2x2' | '3x2' | '3x3' {
    if (quantity >= 9) return '3x3';
    if (quantity >= 6) return '3x2';
    if (quantity >= 4) return '2x2';
    if (quantity >= 2) return '2x1';
    return '1x1';
}

function tileToSpan(tile: '1x1' | '2x1' | '2x2' | '3x2' | '3x3') {
    switch (tile) {
        case '3x3':
            return {w: 3, h: 3};
        case '3x2':
            return {w: 3, h: 2};
        case '2x2':
            return {w: 2, h: 2};
        case '2x1':
            return {w: 2, h: 1};
        case '1x1':
        default:
            return {w: 1, h: 1};
    }
}

function formatDate(d: string | Date): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

export default function PantryMasonry({
                                          items,
                                          color = 'neutral',
                                          loading = false,
                                          skeletonCount,
                                          onDeleteItem
                                      }: PantryMasonryProps) {
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const columns = useMasonryColumns(containerEl, 6);

    // Skeleton placeholders: cycle through a pleasing mix of spans
    const skeletonTiles: Array<'3x3' | '3x2' | '2x2' | '2x1' | '1x1'> = useMemo(() => (
        ['3x3', '3x2', '2x2', '2x1', '1x1']
    ), []);

    const skItems = useMemo(() => {
        const count = skeletonCount ?? Math.max(columns * 3, 6);
        return Array.from({length: count}, (_, i) => ({
            id: `sk-${i}`,
            tile: skeletonTiles[i % skeletonTiles.length]
        }));
    }, [columns, skeletonCount, skeletonTiles]);

    const placedSkeletons = useMasonryPlacement(
        skItems,
        (it) => tileToSpan(it.tile as any),
        columns
    );

    const placed = useMasonryPlacement(
        useMemo(() => items.slice().sort((a, b) => b.quantity - a.quantity), [items]),
        (it) => tileToSpan(quantityToTile(it.quantity)),
        columns
    );

    return (
        <Box ref={setContainerEl} className="pantry-masonry" aria-busy={loading}>
            {loading ? (
                placedSkeletons.map((item: any) => {
                    const style = {
                        gridColumn: `${item.col} / span ${item.w}`,
                        gridRow: `${item.row} / span ${item.h}`,
                    } as const;
                    return (
                        <Card key={item.id} variant="soft" className="pantry-card" style={style} sx={{p: 1.5}}>
                            <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '100%'}}>
                                <Skeleton variant="text" level="title-lg" sx={{width: '70%'}}/>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Skeleton variant="rectangular" sx={{width: 72, height: 24, borderRadius: 12}}/>
                                    <Skeleton variant="text" level="body-sm" sx={{width: 80}}/>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                placed.map((item) => {
                    const tile = quantityToTile(item.quantity);
                    const tileClass = `tile-${tile}`;
                    const style = {
                        gridColumn: `${item.col} / span ${item.w}`,
                        gridRow: `${item.row} / span ${item.h}`,
                    } as const;

                    return (
                        <DeletableItem
                            key={item.id}
                            itemId={item.id}
                            onDelete={() => onDeleteItem?.(item.id)}
                            confirmMessage={`Are you sure you want to delete "${item.title}"?`}
                            deleteButtonPosition="top-right"
                            style={style}
                        >
                            <Card
                                variant="soft"
                                color={color}
                                className={`pantry-card ${tileClass}`}
                                sx={{p: 1}}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%'
                                    }}
                                >
                                    <Typography level="h3" noWrap sx={{mb: 0.5}}>
                                        {item.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Chip
                                            size="sm"
                                            variant="solid"
                                            color={color}
                                            sx={{fontWeight: 600}}
                                        >
                                            Qty: {item.quantity}
                                        </Chip>
                                        <Typography level="body-sm" sx={{opacity: 0.8}}>
                                            {formatDate(item.date)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </DeletableItem>
                    );
                })
            )}
        </Box>
    );
}
