import type { ReactNode } from "react";

type ChildrenProps = { children: ReactNode };

type CoverMessageProps = ChildrenProps & {
    at: number; // centro vertical del texto sobre la imagen, en %
};

export const CoverMessage = ({ at, children }: CoverMessageProps) => {
    return (
        // El exterior centra; el interior es lo que anima GSAP (no fusionar: el transform colisiona).
        <div
            className="absolute left-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2 px-6"
            style={{ top: `${at}%` }}
        >
            <div
                data-cover-message
                className="relative mx-auto flex w-full max-w-[min(70ch,90vw)] flex-col items-center text-center text-white opacity-0"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-14 -z-10 rounded-[999px] bg-black/25 blur-[60px] opacity-70"
                />
                {children}
            </div>
        </div>
    );
};

CoverMessage.Paragraph = ({ children }: ChildrenProps) => (
    <p className="text-pretty text-sm font-light leading-snug tracking-[0.01em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:text-xl sm:leading-normal md:text-2xl">
        {children}
    </p>
);

CoverMessage.Title = ({ children }: ChildrenProps) => (
    <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
        {children}
    </h1>
);

CoverMessage.Subtitle = ({ children }: ChildrenProps) => (
    <p className="mt-4 text-lg font-light leading-[1.4] tracking-[0.01em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] sm:text-2xl md:text-3xl">
        {children}
    </p>
);
