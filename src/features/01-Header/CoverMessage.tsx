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
                className="relative mx-auto flex w-full max-w-[min(680px,90vw)] flex-col items-center text-center text-white opacity-0"
            >
                {children}
            </div>
        </div>
    );
};

CoverMessage.Paragraph = ({ children }: ChildrenProps) => (
    // Figma: Elza Regular 26px / lh 1.4 / tracking 0.02em (rol "cuerpo")
    <p className="text-pretty text-sm leading-[1.4] tracking-[0.02em] sm:text-xl md:text-[26px]">
        {children}
    </p>
);

CoverMessage.Title = ({ children }: ChildrenProps) => (
    // Figma: Citizen Bold 150px / lh 0.9 / tracking 0.02em / uppercase (rol "hero display")
    <h1 className="text-5xl font-bold leading-[0.9] tracking-[0.02em] sm:text-8xl md:text-[150px]">
        {children}
    </h1>
);

CoverMessage.Subtitle = ({ children }: ChildrenProps) => (
    // Figma: Elza Regular 42px / lh 1.4 / tracking 0.02em (rol "subtítulo hero")
    <p className="mt-4 text-base leading-[1.4] tracking-[0.02em] sm:text-2xl md:text-[42px]">
        {children}
    </p>
);
