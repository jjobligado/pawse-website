/**
 * Rasterizes "PAWSE" in the loaded Pixelify Sans font onto an integer pixel grid.
 *
 * Shared by the footer-lab wordmark variants. Same sampling rules as
 * components/pixel-wordmark.tsx: A and W are mirrored so they stay perfectly
 * symmetrical, and the bars on P and A are capped so they don't look bloated.
 */

export const LETTERS = ["P", "A", "W", "S", "E"] as const;
export type Letter = (typeof LETTERS)[number];

interface RawGlyph {
    ch: Letter;
    canvas: HTMLCanvasElement;
    minX: number;
    minY: number;
    w: number;
    h: number;
}

export interface GlyphData {
    glyphs: RawGlyph[];
    minTop: number;
    totalH: number;
}

export interface SampledGlyph {
    ch: Letter;
    gCols: number;
    /** grid[row][col] is true where the letter has a pixel. */
    grid: boolean[][];
}

export function measureGlyphs(fontFamily: string): GlyphData | null {
    const glyphs: RawGlyph[] = [];

    for (const ch of LETTERS) {
        const g = document.createElement("canvas");
        g.width = 400;
        g.height = 420;
        const gctx = g.getContext("2d", { willReadFrequently: true });
        if (!gctx) return null;

        gctx.fillStyle = "#000000";
        gctx.font = `700 260px ${fontFamily}`;
        gctx.textBaseline = "top";
        gctx.fillText(ch, 20, 40);

        const d = gctx.getImageData(0, 0, g.width, g.height).data;
        let minX = g.width;
        let minY = g.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < g.height; y++) {
            for (let x = 0; x < g.width; x++) {
                if (d[(y * g.width + x) * 4 + 3] > 20) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX <= minX || maxY <= minY) return null;
        glyphs.push({ ch, canvas: g, minX, minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    }

    const minTop = Math.min(...glyphs.map((item) => item.minY));
    const maxBot = Math.max(...glyphs.map((item) => item.minY + item.h));
    return { glyphs, minTop, totalH: maxBot - minTop };
}

export function sampleGlyphs(data: GlyphData, rows: number): SampledGlyph[] | null {
    const sampled: SampledGlyph[] = [];

    for (const rg of data.glyphs) {
        let gCols = Math.max(6, Math.round((rg.w / data.totalH) * rows));
        if ((rg.ch === "A" || rg.ch === "W") && gCols % 2 !== 0) gCols += 1;

        const samp = document.createElement("canvas");
        samp.width = gCols * 4;
        samp.height = rows * 4;
        const sctx = samp.getContext("2d", { willReadFrequently: true });
        if (!sctx) return null;

        sctx.drawImage(rg.canvas, rg.minX, data.minTop, rg.w, data.totalH, 0, 0, samp.width, samp.height);
        const sd = sctx.getImageData(0, 0, samp.width, samp.height).data;
        const grid: boolean[][] = Array.from({ length: rows }, () => Array(gCols).fill(false));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < gCols; c++) {
                let sum = 0;
                for (let sy = 0; sy < 4; sy++) {
                    for (let sx = 0; sx < 4; sx++) {
                        sum += sd[((r * 4 + sy) * samp.width + (c * 4 + sx)) * 4 + 3];
                    }
                }
                grid[r][c] = sum / 4080 >= 0.44;
            }
        }

        // Mirror A and W so both sides are exactly symmetrical
        if (rg.ch === "A" || rg.ch === "W") {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < Math.floor(gCols / 2); c++) {
                    grid[r][gCols - 1 - c] = grid[r][c];
                }
            }
        }

        // Cap the cap and crossbar of A at 4 rows
        if (rows === 20 && rg.ch === "A") {
            const mid = Math.floor(gCols / 2);
            let topSolid = 0;
            for (let r = 0; r <= 6; r++) {
                if (grid[r][mid - 1] && grid[r][mid]) {
                    topSolid++;
                    if (topSolid > 4) {
                        grid[r][mid - 1] = false;
                        grid[r][mid] = false;
                    }
                } else {
                    break;
                }
            }
            const barRows: number[] = [];
            for (let r = 9; r <= 17; r++) {
                if (grid[r][mid - 1] && grid[r][mid]) barRows.push(r);
            }
            while (barRows.length > 4) {
                const dropRow = barRows.pop()!;
                const archRow = Math.min(rows - 1, dropRow + 1);
                for (let c = 4; c < gCols - 4; c++) {
                    if (!grid[archRow][c]) grid[dropRow][c] = false;
                }
                grid[dropRow][mid - 1] = false;
                grid[dropRow][mid] = false;
            }
        }

        // Cap the top and middle bars of P at 4 rows
        if (rows === 20 && rg.ch === "P") {
            const midCol = Math.floor(gCols / 2);
            let topBridged = 0;
            for (let r = 0; r <= 6; r++) {
                if (grid[r][4] && grid[r][midCol]) {
                    topBridged++;
                    if (topBridged > 4) {
                        for (let c = 4; c < gCols - 4; c++) grid[r][c] = false;
                    }
                }
            }
            const midRows: number[] = [];
            for (let r = 8; r <= 15; r++) {
                if (grid[r][4] && grid[r][5] && grid[r][6]) midRows.push(r);
            }
            while (midRows.length > 4) {
                const dropRow = midRows.pop()!;
                for (let c = 4; c < gCols; c++) grid[dropRow][c] = false;
            }
        }

        sampled.push({ ch: rg.ch, gCols, grid });
    }

    return sampled;
}
