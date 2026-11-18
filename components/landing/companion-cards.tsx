import CompanionButton, { type AppCompanion } from "@/components/app-ui/companion-button";

/**
 * The three companions as the app's own picker buttons, in a row (stacked on
 * phones). Each card scales as one piece with its width (see .app-cat-scale
 * in globals.css): fluid up to 330px, and in the row the three share the space.
 * Static: no entrance motion. The life comes from the cats' idle
 * routine and the app's hover.
 */

interface CardData {
    companion: AppCompanion;
    /** First pose (1-4), distinct per cat so server and client agree */
    initialPose: number;
}

// Same companions, modes and session lengths as the app's picker
const CARDS: CardData[] = [
    {
        companion: { id: "tux", name: "Tux", mode: "Classic", theme: "classic", focusMin: 25, breakMin: 5 },
        initialPose: 1,
    },
    {
        companion: { id: "ginger", name: "Ginger", mode: "Sprint", theme: "sprint", focusMin: 15, breakMin: 3 },
        initialPose: 2,
    },
    {
        companion: { id: "void", name: "Void", mode: "Focused", theme: "focused", focusMin: 50, breakMin: 10 },
        initialPose: 3,
    },
];

export default function CompanionCards() {
    return (
        <ul className="relative w-full max-w-[1110px] flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 xl:gap-10 py-2">
            {CARDS.map((card) => (
                <li key={card.companion.id} className="app-cat-scale w-full max-w-[330px] lg:flex-1 lg:min-w-0">
                    <CompanionButton companion={card.companion} initialPose={card.initialPose} />
                </li>
            ))}
        </ul>
    );
}
