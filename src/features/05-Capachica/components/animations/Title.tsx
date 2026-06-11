type TitleProps = {
    start: number;
    end: number;
    title: string;
};

export const Title = ({ start, end, title }: TitleProps) => {
    return (
        <div
            className="absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-18 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <h2 className="font-[Citizen] text-center text-[40px] leading-10 font-bold uppercase text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
                {title}
            </h2>
        </div>
    );
};