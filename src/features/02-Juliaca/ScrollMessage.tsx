import { Children, isValidElement, useState, useEffect } from "react";
import type { ReactNode } from "react";

type ScrollMessageProps = {
    start: number;
    end: number;
    children: ReactNode;
    background?: boolean;
};

export const ScrollMessage = ({ start, end, children, background = true }: ScrollMessageProps) => {
    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center px-4 opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="flex w-full items-center justify-center text-white">
                <div
                    className="max-w-full [&_img]:block [&_img]:max-w-full py-8 px-4 md:py-[3.25rem] md:px-[3rem]"
                    style={background ? { backgroundColor: "rgba(10,10,10,0.75)" } : undefined}
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

ScrollMessage.Paragraph = ({ children }: ScrollParagraphProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const content =
        isMobile ?
            Children.map(children, (child) => (isValidElement(child) && child.type === "br" ? " " : child))
        :   children;

    return (
        // Figma: Elza Regular 26px / lh 1.4 / tracking 0.02em (rol "cuerpo")
        <p
            className="text-base md:text-[26px]"
            style={{
                lineHeight: "140%",
                letterSpacing: "0.02em",
                textAlign: "center",
                margin: 0,
                textWrap: "pretty",
            }}
        >
            {content}
        </p>
    );
};

type ScrollChapterProps = {
    children: ReactNode;
};

ScrollMessage.Chapter = ({ children }: ScrollChapterProps) => (
    <p
        style={{
            fontSize: 13,
            lineHeight: "1.6",
            letterSpacing: "0.25em",
            textAlign: "center",
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
    // Figma: Citizen Bold 64px / lh 1.2 / tracking 0.02em (rol "título de sección grande")
    <h2 className="mb-2 text-center text-3xl md:text-[64px] font-bold leading-[1.2] tracking-[0.02em] font-[Citizen]">
        {children}
    </h2>
);

type ScrollImageHeadingProps = {
    children: ReactNode;
};

ScrollMessage.ImageHeading = ({ children }: ScrollImageHeadingProps) => (
    <h3 className="mb-6 text-center text-2xl leading-[1.4] tracking-[0.03em]">{children}</h3>
);

type ScrollImageProps = {
    src: string;
    alt: string;
};

ScrollMessage.Image = ({ src, alt }: ScrollImageProps) => <img src={src} alt={alt} className="max-h-[50vh] mx-auto" />;
