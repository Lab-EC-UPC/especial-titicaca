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
            <div className="flex justify-center px-4 pb-10 sm:px-6 sm:pb-12 md:pb-14 lg:px-6 lg:pb-16">
                <div className="flex flex-col items-center gap-4 text-center sm:gap-5 md:flex-row md:items-center md:gap-6 md:text-left lg:gap-8">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C03A84] sm:h-11 sm:w-11 md:h-15 md:w-15 lg:h-16 lg:w-16">
                        <span className="font-[Citizen] text-[16px] leading-none font-bold text-[#F4F4F4] sm:text-[18px] md:text-[22px] lg:text-[24px]">
                            {step}
                        </span>
                    </div>

                    <p className="max-w-[85vw] font-[Elza] leading-[1.35] text-white sm:max-w-[75vw] md:max-w-[65vw] lg:max-w-247.25 lg:leading-7.75 sm:text-[16px] md:text-[22px] lg:text-[26px]">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};