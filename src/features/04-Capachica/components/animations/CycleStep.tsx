type CycleStepProps = {
    start: number;
    end: number;
    step: "A" | "B" | "C" | "D";
    text: string;
};

export const CycleStep = ({ start, end, step, text }: CycleStepProps) => {
    return (
        <div
            className="absolute inset-x-0 bottom-0 z-20 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="flex justify-center px-6 pb-16">
                <div className="flex items-center gap-8">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#C03A84]">
                        <span className="font-[Citizen] text-[24px] leading-none font-bold text-[#F4F4F4]">
                            {step}
                        </span>
                    </div>

                    <p className="max-w-247.25 font-[Elza] text-[24px] leading-7.75 text-white">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};