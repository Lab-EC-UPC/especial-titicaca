export type GalleryImage = {
    src: string;
    alt: string;
    description: string;
    subtext: string;
};

type GalleryProps = {
    title: string;
    images: GalleryImage[];
    start?: number;
    snap?: number;
    transition?: number;
};

export const Gallery = ({ title, images, start, snap, transition }: GalleryProps) => {
    const trans = transition ?? Math.round((snap ?? 130) * 0.7);
    return (
        <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 opacity-0 pointer-events-none"
            data-gallery
            data-start={start}
            data-images={images.length}
            data-snap={snap}
            data-transition={trans}
        >
            <h2 className="text-center text-xl md:text-2xl font-bold leading-[1.4] tracking-[0.2em] uppercase text-white">
                {title}
            </h2>

            <div className="relative w-screen overflow-hidden" style={{ height: "60vh" }}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        data-gallery-image={i}
                        className="absolute left-1/2 top-1/2 flex flex-col items-center will-change-transform"
                        style={{ width: "60vw", maxHeight: "60vh", opacity: 0 }}
                    >
                        <div className="flex flex-col items-start gap-4">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="max-h-[45vh] w-auto max-w-full object-contain"
                            />

                            <div data-gallery-text className="flex flex-col items-start gap-1 text-left ml-5 opacity-0">
                                <p
                                    className="text-sm md:text-lg"
                                    style={{
                                        fontFamily:
                                            'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                                        lineHeight: "130%",
                                        letterSpacing: "0.02em",
                                        color: "white",
                                        fontWeight: 300,
                                        margin: 0,
                                        textWrap: "pretty",
                                    }}
                                >
                                    {img.description}
                                </p>
                                <p
                                    className="text-xs md:text-sm"
                                    style={{
                                        fontFamily:
                                            'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                                        lineHeight: "130%",
                                        letterSpacing: "0.1em",
                                        color: "rgba(255,255,255,0.6)",
                                        fontWeight: 300,
                                        margin: 0,
                                        textWrap: "pretty",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {img.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
