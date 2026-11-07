import SplitFeature from "./split-feature";
import TimerMockup from "./timer-mockup";

export default function FocusSection() {
    return (
        <SplitFeature
            id="focus"
            titleLines={["Your Quiet", "Co-Working Space"]}
            media={<TimerMockup />}
            spacing="pair-start"
        >
            No jarring alarms. No visual clutter. While your timer counts down, your
            companion settles into their own low-stimulation routine—whether
            that&apos;s reading a book, napping, or making biscuits. Just quiet,
            uninterrupted focus.
        </SplitFeature>
    );
}
