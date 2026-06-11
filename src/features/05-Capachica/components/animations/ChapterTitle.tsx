type ChapterTitleProps = {
    start: number;
    end: number;
    title: string;
    description: string;
};

export const ChapterTitle = ({
    start,
    end,
    title,
    description,
}: ChapterTitleProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center px-4 sm:px-6 md:px-8 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="flex flex-col items-center text-center drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
                <h2 className="mb-3 max-w-[85vw] whitespace-pre-line font-[Citizen] text-2xl font-black uppercase leading-[1.1] tracking-[0.04em] text-white sm:mb-4 sm:max-w-[70vw] sm:text-4xl md:mb-5 md:max-w-[90vw] md:text-5xl lg:text-6xl">
                    {title}
                </h2>

                <div className="max-w-[85vw] sm:max-w-[65vw] md:max-w-[min(64ch,90vw)] lg:max-w-[90ch]">
                    <p className="font-[Elza] leading-[1.3] tracking-[0.02em] text-white/70 sm:text-[14px] md:text-[22px] lg:text-[24px]">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};