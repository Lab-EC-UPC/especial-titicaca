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
            <div className="relative flex w-full max-w-[min(46ch,90vw)] items-center justify-center text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-3.5rem] -z-10 rounded-[999px] bg-black/70 blur-[52px] opacity-95"
                />
                <div className="relative z-10 max-w-full drop-shadow-[0_16px_26px_rgba(0,0,0,0.92)] [&_img]:block [&_img]:max-w-full [&_img]:rounded-[1.25rem]">
                    {children}
                </div>
            </div>
        </div>
    );
};
