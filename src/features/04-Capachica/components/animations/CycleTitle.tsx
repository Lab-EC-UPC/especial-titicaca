type CycleTitleProps = {
    start: number;
    end: number;
    title: string;
};

export const CycleTitle = ({ start, end, title }: CycleTitleProps) => {
    return (
        <div
            className="absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-8 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-base">
                {title}
            </h2>
        </div>
    );
};