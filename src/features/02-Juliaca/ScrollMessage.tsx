import type { ReactNode } from "react";

type ScrollMessageProps = {
    start: number;
    end: number;
    children: ReactNode;
};

export const ScrollMessage = ({ start, end, children }: ScrollMessageProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center px-4 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="relative flex w-full max-w-none items-center justify-center text-white">
                <div
                    className="relative z-10 max-w-full [&_img]:block [&_img]:max-w-full"
                    style={{
                        backgroundColor: "rgba(10,10,10,0.75)",
                        padding: "4.5rem 3rem",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

type ScrollParagraphProps = {
    children: ReactNode;
};

ScrollMessage.Paragraph = ({ children }: ScrollParagraphProps) => (
    <p
        style={{
            fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontSize: 18,
            lineHeight: "130%",
            letterSpacing: "0.02em",
            textAlign: "center",
            color: "white",
            fontWeight: 300,
            margin: 0,
            textWrap: "pretty",
        }}
    >
        {children}
    </p>
);

type ScrollChapterProps = {
    children: ReactNode;
};

ScrollMessage.Chapter = ({ children }: ScrollChapterProps) => (
    <p
        style={{
            fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontSize: 13,
            lineHeight: "1.6",
            letterSpacing: "0.25em",
            textAlign: "center",
            color: "white",
            fontWeight: 400,
            margin: "0 0 8px 0",
            textTransform: "uppercase",
        }}
    >
        {children}
    </p>
);

type ScrollHeadingProps = {
    children: ReactNode;
};

ScrollMessage.Heading = ({ children }: ScrollHeadingProps) => (
    <h2 className="mb-2 text-center text-4xl font-bold leading-[1.4] tracking-[0.03em] text-white">{children}</h2>
);

type ScrollImageHeadingProps = {
    children: ReactNode;
};

ScrollMessage.ImageHeading = ({ children }: ScrollImageHeadingProps) => (
    <h3 className="mb-6 text-center text-2xl leading-[1.4] tracking-[0.03em] text-white">{children}</h3>
);

type ScrollImageProps = {
    src: string;
    alt: string;
};

ScrollMessage.Image = ({ src, alt }: ScrollImageProps) => (
    <img src={src} alt={alt} className="max-h-[50vh] w-auto mx-auto" />
);
