import SplitFeature from "./split-feature";
import TimerMockup from "./timer-mockup";

export default function FocusSection() {
    return (
        <SplitFeature titleLines={["Your quiet", "co-working space"]} media={<TimerMockup />}>
            No jarring alarms. No visual clutter. While your timer counts down, your
            companion settles into their own low-stimulation routine—whether
            that&apos;s reading a book, napping, or making biscuits. Just quiet,
            uninterrupted focus.
        </SplitFeature>
    );
}
