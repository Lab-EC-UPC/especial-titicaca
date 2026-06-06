type ChapterTitleProps = {
    start: number;
    end: number;
    label: string;     
    title: string;       
    description: string;
};

export const ChapterTitle = ({
    start,
    end,
    label,
    title,
    description,
}: ChapterTitleProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center px-6 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="relative max-w-[min(64ch,90vw)] text-center drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
                <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.25em] text-white/70 uppercase md:text-xs">
                    {label}
                </p>

                <h2 className="mb-5 whitespace-pre-line text-3xl font-black uppercase leading-[1.1] tracking-[0.06em] text-white md:text-5xl lg:text-6xl">
                    {title}
                </h2>

                <p className="text-sm font-light leading-[1.6] tracking-[0.02em] text-white/85 md:text-base">
                    {description}
                </p>
            </div>
        </div>
    );
};