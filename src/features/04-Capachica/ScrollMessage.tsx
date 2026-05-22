import type { ReactNode } from "react";

type ScrollMessageProps = {
    start: number;
    end: number;
    children: ReactNode;
};

type ScrollMessageVariant = "default" | "wide";

type ScrollMessageFrameProps = ScrollMessageProps & {
    variant: ScrollMessageVariant;
};

const ScrollMessageFrame = ({ start, end, children, variant }: ScrollMessageFrameProps) => {
    const isWide = variant === "wide";

    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center px-4 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div
                className={`relative flex w-full items-center justify-center text-white ${isWide ? "max-w-[min(92vw,1200px)]" : "max-w-[min(58ch,92vw)]"}`}
            >
                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-[-3.5rem] -z-10 rounded-[999px] blur-[52px] opacity-90 ${isWide ? "bg-black/28" : "bg-black/35"}`}
                />
                <div className="relative z-10 max-w-full drop-shadow-[0_16px_26px_rgba(0,0,0,0.92)] [&_img]:block [&_img]:max-w-full [&_img]:rounded-[1.25rem]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ScrollMessage = ({ start, end, children }: ScrollMessageProps) => {
    return (
        <ScrollMessageFrame start={start} end={end} variant="default">
            {children}
        </ScrollMessageFrame>
    );
};

ScrollMessage.Wide = ({ start, end, children }: ScrollMessageProps) => {
    return (
        <ScrollMessageFrame start={start} end={end} variant="wide">
            {children}
        </ScrollMessageFrame>
    );
};

type ScrollParagraphProps = {
    children: ReactNode;
};

ScrollMessage.Paragraph = ({ children }: ScrollParagraphProps) => (
    <p className="text-center text-lg font-light leading-[1.55] tracking-[0.03em] text-white">{children}</p>
);

type ScrollHeadingProps = {
    children: ReactNode;
    className?: string;
};

ScrollMessage.Heading = ({ children, className }: ScrollHeadingProps) => (
    <h2
        className={`mb-4 text-center text-4xl font-extrabold leading-[1.15] tracking-[0.03em] text-white ${className ?? ""}`}
    >
        {children}
    </h2>
);

type ScrollImageHeadingProps = {
    children: ReactNode;
};

ScrollMessage.ImageHeading = ({ children }: ScrollImageHeadingProps) => (
    <h3 className="mb-8 text-center text-2xl leading-[1.2] tracking-[0.03em] text-white">{children}</h3>
);

type ScrollImageProps = {
    src: string;
    alt: string;
};

ScrollMessage.Image = ({ src, alt }: ScrollImageProps) => (
    <img src={src} alt={alt} className="mx-auto max-h-[46vh] w-auto" />
);
