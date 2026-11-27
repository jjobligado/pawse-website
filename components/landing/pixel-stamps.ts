/**
 * Pixel-art drawings for the How It Works wall and Coming Soon, cut as rubber stamps.
 *
 * One character per grid cell: `k` outline, `e` eyes, `d` / `x` / `z` dark
 * detail. All of those print solid; other letters are fills, left uninked
 * unless the sprite lists them in `solid`. `sym()` takes the left half of a
 * row (centre column included) and mirrors it.
 */

export type StampName =
    | "cat"
    | "tux"
    | "loaf"
    | "fish"
    | "heart"
    | "star"
    | "mug"
    | "paw"
    | "yarn"
    | "clock"
    | "chart"
    | "zzz"
    | "sparkle"
    | "phone"
    | "cloud"
    | "sliders"
    | "note";

export type StampFrame = "none" | "square" | "round";

type Sprite = { rows: string[]; solid?: string };

const sym = (rows: string[]) => rows.map((r) => r + [...r.slice(0, -1)].reverse().join(""));

const put = (rows: string[], pts: [number, number, string][]) => {
    const g = rows.map((r) => [...r]);
    pts.forEach(([x, y, c]) => {
        g[y][x] = c;
    });
    return g.map((r) => r.join(""));
};

const face = (eyes: string[]) =>
    sym([
        ".k......", "kok.....", "kopk....", "koopkkkk", "kooooooo", "kooooooo",
        ...eyes,
        "kpooooop", "koooooko", "koooooww", ".koooooo", "..kkkkkk",
    ]);

const SPRITES: Record<StampName, Sprite> = {
    cat: { rows: face(["kooeeooo", "kooeeooo"]) },
    // Tux prints solid, with the eyes, chin and muzzle left as paper
    tux: {
        solid: "o",
        rows: put(face(["kooeeooo", "kooeeooo"]), [
            [3, 6, "w"], [4, 6, "w"], [3, 7, "w"], [4, 7, "w"], [10, 6, "w"], [11, 6, "w"], [10, 7, "w"], [11, 7, "w"],
            [5, 10, "w"], [6, 10, "w"], [7, 10, "w"], [8, 10, "w"], [9, 10, "w"], [7, 9, "w"],
        ]),
    },
    loaf: { rows: face(["kooooooo", "kooeeooo"]) },
    fish: {
        rows: [
            "....kkkk......",
            "..kkbbbbk...kk",
            ".kbbbbbbbk.kbk",
            "kbebbbbbbbkbbk",
            "kbbbbbbbbbbbbk",
            "kbbbbbbbbbkbbk",
            ".kllllllbk.kbk",
            "..kkllllk...kk",
            "....kkkk......",
        ],
    },
    heart: {
        solid: "r",
        rows: put(sym([".kkk..", "krrrrk", "krrrrr", "krrrrr", ".krrrr", "..krrr", "...krr", "....kr", ".....k"]), [
            [2, 2, "w"], [2, 3, "w"], [3, 2, "w"],
        ]),
    },
    star: {
        rows: put(
            sym(["......k", ".....ky", ".....ky", "....kyy", "kkkkkyy", ".kyyyyy", "..kyyyy", "...kyyy", "..kyyyy", "..kyykk", ".kyyk..", ".kkk..."]),
            [[5, 6, "e"], [7, 6, "e"]],
        ),
    },
    mug: {
        rows: [
            "...d..d.......",
            "....d..d......",
            "...d..d.......",
            "kkkkkkkkkkk...",
            "kccccccccck...",
            "kmmmmmmmmmkkk.",
            "kmmmmmmmmmk.k.",
            "kmmdmmmdmmk.k.",
            "kmmmmmmmmmkkk.",
            "kmmmmmmmmmk...",
            ".kmmmmmmmk....",
            "..kkkkkkk.....",
        ],
    },
    paw: {
        solid: "p",
        rows: sym([".....kk.", "....kppk", ".kk.kppk", "kppk.kk.", "kppk....", ".kk...kk", "....kkpp", "...kpppp", "..kppppp", "..kppppp", "..kppppp", "...kppkk", "....kk.."]),
    },
    yarn: {
        rows: [
            "....kkkkk.....",
            "..kkyyyyykk...",
            ".kyyyddyyyyk..",
            ".kyydyyyddyk..",
            "kyydyyddyyyyk.",
            "kydyyddyyyddk.",
            "kdyyddyyyddyk.",
            "kyyddyyyddyyk.",
            ".kyyyyyddyyk..",
            ".kyyyddyyyyk..",
            "..kkyyyyykk...",
            "....kkkkk.d...",
            "..........dd..",
        ],
    },
    clock: {
        rows: put(
            sym([".....kk", "......k", "...kkkk", "..kwwww", ".kwwwww", "kwwwwww", "kwwwwww", "kwwwwww", "kwwwwww", "kwwwwww", ".kwwwww", "..kwwww", "...kkkk"]),
            [[6, 4, "k"], [6, 5, "k"], [6, 6, "k"], [6, 7, "k"], [7, 7, "k"], [8, 7, "k"], [2, 7, "d"], [10, 7, "d"], [6, 11, "d"], [6, 3, "d"]],
        ),
    },
    chart: {
        rows: [
            ".......kkkk.",
            ".......kbbk.",
            ".......kbbk.",
            "....kkkkbbk.",
            "....kggkbbk.",
            "....kggkbbk.",
            ".kkkkggkbbk.",
            ".kppkggkbbk.",
            ".kppkggkbbk.",
            ".kppkggkbbk.",
            "kkkkkkkkkkkk",
        ],
    },
    zzz: {
        rows: [
            ".......zzzzz",
            ".......zzzzz",
            ".........zz.",
            "........zz..",
            ".......zzzzz",
            ".......zzzzz",
            "............",
            "zzzz........",
            "..z.........",
            ".z..........",
            "zzzz........",
        ],
    },
    sparkle: {
        solid: "y",
        rows: sym([".....k", ".....k", "....ky", "....ky", "..kkyy", "kkyyyy", "..kkyy", "....ky", "....ky", ".....k", ".....k"]),
    },
    phone: {
        rows: put(
            [
                "..kkkkkkkk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kssssssk..",
                "..kwwwwwwk..",
                "..kkkkkkkk..",
            ],
            [
                ...Array.from({ length: 12 }, (_, y): [number, number, string][] => [[11 - y, y, "x"], [Math.max(0, 10 - y), y, "x"]]).flat(),
                [5, 10, "k"], [6, 10, "k"],
            ],
        ),
    },
    // Coming Soon: a cloud with an upload arrow (Save Your Progress)
    cloud: {
        rows: [
            "......kkkk......",
            "....kk....kk....",
            "...k...dd...k...",
            ".kk...dddd...kk.",
            "k....dddddd....k",
            "k......dd......k",
            "k......dd......k",
            ".kkkkkkkkkkkkkk.",
        ],
    },
    // Coming Soon: three mixer sliders (Custom Sessions)
    sliders: {
        rows: [
            ".k...k...k.",
            "kkk..k...k.",
            "kkk..k...k.",
            ".k...k..kkk",
            ".k...k..kkk",
            ".k..kkk..k.",
            ".k..kkk..k.",
            ".k...k...k.",
            ".k...k...k.",
        ],
    },
    // Coming Soon: a pair of beamed music notes (Expanded Audio)
    note: {
        rows: [
            "...kkkkkkk",
            "...kkkkkkk",
            "...k.....k",
            "...k.....k",
            "...k.....k",
            "...k.....k",
            "...k..kkkk",
            ".kkk.kkkkk",
            "kkkk.kkkkk",
            "kkkk..kkk.",
            ".kk.......",
        ],
    },
};

const INK = new Set(["k", "e", "d", "x", "z"]);

/** Inked cells of a stamp as row runs `[x, y, length]`, plus the stamp's grid size. */
export function stampRuns(name: StampName, frame: StampFrame = "none") {
    const s = SPRITES[name];
    const rows = s.rows;
    const h = rows.length;
    const w = Math.max(...rows.map((r) => r.length));
    let W: number, H: number, ox: number, oy: number;
    if (frame === "round") {
        const R = Math.ceil(Math.hypot(w, h) / 2) + 1;
        W = H = R * 2 + 1;
        ox = Math.floor((W - w) / 2);
        oy = Math.floor((H - h) / 2);
    } else if (frame === "square") {
        W = w + 6;
        H = h + 6;
        ox = oy = 3;
    } else {
        W = w + 2;
        H = h + 2;
        ox = oy = 1;
    }

    const cells = Array.from({ length: H }, () => Array<boolean>(W).fill(false));
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const c = rows[y][x] ?? ".";
            if (INK.has(c) || (s.solid && s.solid.includes(c))) cells[y + oy][x + ox] = true;
        }
    }
    if (frame === "square") {
        for (let x = 2; x <= W - 3; x++) cells[0][x] = cells[H - 1][x] = true;
        for (let y = 2; y <= H - 3; y++) cells[y][0] = cells[y][W - 1] = true;
        cells[1][1] = cells[1][W - 2] = cells[H - 2][1] = cells[H - 2][W - 2] = true;
    }
    if (frame === "round") {
        const c = (W - 1) / 2;
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const d = Math.hypot(x - c, y - c);
                if (d <= c + 0.2 && d > c - 0.85) cells[y][x] = true;
            }
        }
    }

    const runs: [number, number, number][] = [];
    for (let y = 0; y < H; y++) {
        let x = 0;
        while (x < W) {
            if (!cells[y][x]) {
                x++;
                continue;
            }
            let x2 = x + 1;
            while (x2 < W && cells[y][x2]) x2++;
            runs.push([x, y, x2 - x]);
            x = x2;
        }
    }
    return { W, H, runs };
}
