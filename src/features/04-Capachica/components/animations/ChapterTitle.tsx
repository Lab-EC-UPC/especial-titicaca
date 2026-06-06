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
            <div className="flex flex-col items-center text-center drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
                <div className="max-w-[min(64ch,90vw)]">
                    <p className="font-[Citizen] mb-3 text-[18px] font-semibold tracking-[0.25em] text-[#F5F5F550] uppercase">
                        {label}
                    </p>
                </div>

                <h2 className="mb-5 max-w-[90vw] whitespace-pre-line font-[Citizen] text-3xl font-black uppercase leading-[1.1] tracking-[0.06em] text-white md:text-5xl lg:text-6xl">
                    {title}
                </h2>

                <div className="max-w-[min(64ch,90vw)]">
                    <p className="font-[Elza] whitespace-pre-line text-[26px] leading-[1.6] tracking-[0.02em] text-white md:text-base">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};