import SplitFeature from "./split-feature";
import BreakDemo from "./break-demo";

export default function BreakSection() {
    return (
        <SplitFeature
            id="break"
            titleLines={["Time to Play", "and Recharge"]}
            media={<BreakDemo />}
            mediaFirst
            spacing="pair-end"
        >
            When the interval ends, the quiet time is over. Your companion wakes up
            ready for energetic playtime. Trigger unique animations, read their
            random thoughts, and give your brain a mindful break before the next
            session.
        </SplitFeature>
    );
}
