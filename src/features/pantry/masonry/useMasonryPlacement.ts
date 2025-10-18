import {useEffect, useMemo, useState} from 'react';

export type Span = { w: number; h: number };

export type Placeable<T> = T & Span & { id: string };

export type Placed<T> = Placeable<T> & { col: number; row: number };

function parseCssInt(value: string, fallback: number): number {
    const n = parseInt(value.trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function useMasonryColumns(container: HTMLElement | null, fallback = 6) {
    const [columns, setColumns] = useState<number>(fallback);

    useEffect(() => {
        if (!container) return;
        const compute = () => {
            const styles = getComputedStyle(container);
            // Try container first; fallback to root
            const raw = styles.getPropertyValue('--masonry-columns') || getComputedStyle(document.documentElement).getPropertyValue('--masonry-columns');
            const cols = parseCssInt(raw, fallback);
            setColumns(cols);
        };

        compute();

        const ro = new ResizeObserver(() => compute());
        ro.observe(container);

        const mqHandlers: MediaQueryList[] = [
            window.matchMedia('(max-width: 1400px)'),
            window.matchMedia('(max-width: 1200px)'),
            window.matchMedia('(max-width: 900px)'),
            window.matchMedia('(max-width: 600px)'),
            window.matchMedia('(max-width: 420px)')
        ];
        mqHandlers.forEach((mq) => mq.addEventListener('change', compute));

        return () => {
            ro.disconnect();
            mqHandlers.forEach((mq) => mq.removeEventListener('change', compute));
        };
    }, [container, fallback]);

    return columns;
}

// Packs items with a top-left bias.
// Placement strategy per item:
// 1) Columns left->right, search rows up to current top band (maxOccupiedRow) to keep items as high as possible;
// 2) If no fit, allow deeper rows (still columns left->right), which stacks vertically when top is filled.
export function useMasonryPlacement<T extends { id: string }>(
    items: T[],
    toSpan: (item: T) => Span,
    columns: number
) {
    return useMemo<Placed<T>[]>(() => {
        if (!columns || columns < 1) return [];

        const placeables: Placeable<T>[] = items.map((it) => {
            const {w, h} = toSpan(it);
            const clampedW = Math.max(1, Math.min(columns, Math.round(w)));
            const clampedH = Math.max(1, Math.round(h));
            return {...(it as any), w: clampedW, h: clampedH} as Placeable<T>;
        });

        // Occupancy grid and a global top band tracker
        const rows: boolean[][] = [];
        let maxOccupiedRow = 0; // highest row index that has any occupancy

        const fitsAt = (rowStart: number, colStart: number, w: number, h: number) => {
            for (let r = rowStart; r < rowStart + h; r++) {
                const row = rows[r] || (rows[r] = Array(columns + 1).fill(false));
                for (let c = colStart; c < colStart + w; c++) {
                    if (c > columns) return false;
                    if (row[c]) return false;
                }
            }
            return true;
        };

        const occupy = (rowStart: number, colStart: number, w: number, h: number) => {
            for (let r = rowStart; r < rowStart + h; r++) {
                const row = rows[r] || (rows[r] = Array(columns + 1).fill(false));
                for (let c = colStart; c < colStart + w; c++) {
                    row[c] = true;
                }
            }
            maxOccupiedRow = Math.max(maxOccupiedRow, rowStart + h - 1);
        };

        const placed: Placed<T>[] = [];
        const lastColByWidth = new Map<number, number>();

        const firstFitRowForCol = (colStart: number, w: number, h: number) => {
            let row = 1;
            const maxRowsSoftCap = Math.max(1000, items.length * 8);
            while (row < maxRowsSoftCap) {
                if (fitsAt(row, colStart, w, h)) return row;
                row++;
            }
            return Number.POSITIVE_INFINITY;
        };

        for (const item of placeables) {
            const maxStart = Math.max(1, columns - item.w + 1);

            // Compute earliest fit per column
            let bestCol = 1;
            let bestRow = Number.POSITIVE_INFINITY;
            const colRows: number[] = [];
            for (let colStart = 1; colStart <= maxStart; colStart++) {
                const fitRow = firstFitRowForCol(colStart, item.w, item.h);
                colRows[colStart] = fitRow;
                if (fitRow < bestRow) {
                    bestRow = fitRow;
                    bestCol = colStart;
                }
            }

            // 1) Prefer filling within the current top band (does not increase total height)
            const inBandCols: number[] = [];
            if (maxOccupiedRow > 0 && Number.isFinite(bestRow)) {
                for (let c = 1; c <= maxStart; c++) {
                    const r = colRows[c];
                    if (Number.isFinite(r) && (r + item.h - 1) <= maxOccupiedRow) {
                        inBandCols.push(c);
                    }
                }
            }

            let chosenCol = bestCol;
            let chosenRow = bestRow;

            if (inBandCols.length > 0) {
                // Prefer stacking same-width if available in-band; else choose leftmost in-band
                const prevCol = lastColByWidth.get(item.w);
                if (prevCol && inBandCols.includes(prevCol)) {
                    chosenCol = prevCol;
                    chosenRow = colRows[prevCol]!;
                } else {
                    chosenCol = inBandCols[0];
                    chosenRow = colRows[chosenCol]!;
                }
            } else {
                // 2) Fallback: choose minimal row across columns; tie-break leftmost
                chosenCol = bestCol;
                chosenRow = bestRow;

                // Width-based stacking as a soft preference only when it doesn't worsen the minimal row
                const prevCol = lastColByWidth.get(item.w);
                if (prevCol && Number.isFinite(colRows[prevCol]) && colRows[prevCol]! <= bestRow) {
                    chosenCol = prevCol;
                    chosenRow = colRows[prevCol]!;
                }
            }

            if (Number.isFinite(chosenRow)) {
                occupy(chosenRow, chosenCol, item.w, item.h);
                placed.push({...(item as any), col: chosenCol, row: chosenRow});
                lastColByWidth.set(item.w, chosenCol);
            } else {
                // Final fallback: new row, leftmost column
                const lastRow = rows.length + 1;
                occupy(lastRow, 1, item.w, item.h);
                placed.push({...(item as any), col: 1, row: lastRow});
                lastColByWidth.set(item.w, 1);
            }
        }

        // Reading order for deterministic DOM
        return placed.slice().sort((a, b) => (a.row - b.row) || (a.col - b.col));
    }, [items, toSpan, columns]);
}
