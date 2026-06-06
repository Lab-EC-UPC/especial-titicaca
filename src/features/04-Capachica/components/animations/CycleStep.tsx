// Overlay: barra inferior con badge rosa (letra A/B/C/D) + texto del paso.
// Reproduce exactamente el diseño de los frames 5-14 del video de ejemplo.

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
            {/* Barra con gradiente semitransparente hacia negro */}
            <div className="bg-linear-to-t from-black/75 via-black/50 to-transparent px-6 pb-8 pt-10 md:px-10 md:pb-10">
                <div className="mx-auto flex max-w-3xl items-center gap-4">
                    {/* Badge rosa circular con letra */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e91e8c] text-sm font-bold text-white shadow-[0_0_12px_rgba(233,30,140,0.6)]">
                        {step}
                    </div>

                    {/* Texto del paso */}
                    <p className="text-sm font-light leading-[1.5] tracking-[0.02em] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-base">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};