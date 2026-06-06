type IntroMessageProps = {
    start: number;
    end: number;
    text: string;
};

export const IntroMessage = ({ start, end, text }: IntroMessageProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="relative mx-4 max-w-[min(60ch,88vw)]">
                <div className="rounded-sm bg-black/70 px-10 py-8 text-center">
                    <p className="text-sm font-light leading-[1.65] tracking-[0.02em] text-white/90 md:text-base">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};