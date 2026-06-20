type TitleProps = {
    start: number;
    end: number;
    title: string;
};

export const Title = ({ start, end, title }: TitleProps) => {
    return (
        <div
            className="absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-10 opacity-0 pointer-events-none sm:pt-14 md:pt-16 lg:pt-18"
            data-start={start}
            data-end={end}
        >
            <h2 className="max-w-[90vw] font-[Citizen] text-center text-[24px] leading-[1.2] tracking-[0.02em] font-bold uppercase text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] sm:max-w-[80vw] sm:text-[28px] md:max-w-[85vw] md:text-[34px] lg:text-[40px]">
                {title}
            </h2>
        </div>
    );
};