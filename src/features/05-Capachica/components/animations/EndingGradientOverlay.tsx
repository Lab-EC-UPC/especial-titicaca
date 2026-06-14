/**
 * Full-screen gradient overlay that darkens the background video toward the
 * end of the section, fading in/out alongside the final chapter title.
 */
interface EndingGradientOverlayProps {
    start: number;
    end: number;
}

export const EndingGradientOverlay = ({ start, end }: EndingGradientOverlayProps) => (
    <div
        className="absolute inset-0 z-10 flex flex-col opacity-0"
        data-start={start}
        data-end={end}
    >
        {/* Rectangle 1508 */}
        <div
            className="w-full"
            style={{
                height: "70.2%",
                background:
                    "linear-gradient(180deg, rgba(47, 74, 68, 0) 0%, rgba(46, 52, 60, 0.5) 52.88%, rgba(46, 52, 60, 0.9) 100%)",
            }}
        />
        {/* Rectangle 1706 */}
        <div
            className="w-full"
            style={{
                height: "29.8%",
                background: "linear-gradient(180deg, rgba(46, 52, 60, 0.9) 0%, #2E343C 100%)",
            }}
        />
    </div>
);