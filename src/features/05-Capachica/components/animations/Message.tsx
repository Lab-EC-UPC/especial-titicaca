type MessageProps = {
    start: number;
    end: number;
    text: string;
};

export const Message = ({ start, end, text }: MessageProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="relative mx-4 max-w-65 md:max-w-120 lg:max-w-210">
                <div className="bg-black/60 px-6 py-10 text-center md:px-12 md:py-16">
                    <p className="font-inter lg:text-[22px] md:text-[16px] sm:text-[14px] font-light leading-[1.6] tracking-[0.02em] text-white/90 md:leading-[1.65]">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};