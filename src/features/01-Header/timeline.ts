import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Cada bloque de texto hace fade-up al entrar en pantalla y se desvanece al salir.
export function initCoverScroll(container: HTMLElement): () => void {
    const messages = Array.from(
        container.querySelectorAll<HTMLElement>("[data-cover-message]"),
    );

    const tweens = messages.map((message) =>
        gsap.fromTo(
            message,
            { autoAlpha: 0, y: 48, filter: "blur(10px)" },
            {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power3.out",
                scrollTrigger: {
                    trigger: message,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse",
                },
            },
        ),
    );

    return () => {
        tweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
        });
    };
}
