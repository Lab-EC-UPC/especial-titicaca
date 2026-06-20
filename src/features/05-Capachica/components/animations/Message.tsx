import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";

type MessageProps = {
    start: number;
    end: number;
    children: ReactNode;
};

export const Message = ({ start, end, children }: MessageProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const content = isMobile
        ? Children.map(children, (child) =>
              isValidElement(child) && child.type === "br" ? " " : child
          )
        : children;

    return (
        <div
            className="absolute inset-0 z-20 grid place-items-center opacity-0 pointer-events-none"
            data-start={start}
            data-end={end}
        >
            <div className="relative mx-4 max-w-65 md:max-w-140 lg:max-w-210">
                <div className="bg-black/60 px-6 py-10 text-center md:px-12 md:py-16">
                    <p
                        className="text-[16px] text-white md:text-[22px] lg:text-[26px]"
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
                </div>
            </div>
        </div>
    );
};