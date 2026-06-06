import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { initCoverScroll } from "./timeline";
import { CoverMessage } from "./CoverMessage";
import { getYouTubeId } from "./youtube";
import { COVER_BANDS } from "./cover-data";

gsap.registerPlugin(useGSAP);

const YOUTUBE = "1XulRzFnTYE";
const youTubeId = getYouTubeId(YOUTUBE);

export const HeaderSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      return initCoverScroll(section);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="inicio" className="relative w-full bg-black">
      {COVER_BANDS.map((band, index) => (
        <div
          key={band.src}
          className="relative w-full"
          style={{
            aspectRatio: `${band.width} / ${band.height}`,
            backgroundImage: `url(${band.placeholder})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={band.src}
            alt=""
            aria-hidden="true"
            width={band.width}
            height={band.height}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            className="block h-auto w-full select-none"
          />
        </div>
      ))}

      <CoverMessage at={6}>
        <CoverMessage.Paragraph>
          El Titicaca es el lago navegable más alto del mundo y el principal
          recurso hídrico, pesquero y turístico para las poblaciones ribereñas
          de Perú y Bolivia. Hoy, su equilibrio está en riesgo.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={22}>
        <CoverMessage.Paragraph>
          Los ríos que alimentan al lago reciben descargas continuas de aguas
          residuales y basura sin tratamiento previo. La provincia de San Román
          (Juliaca) concentra más del 87% del volumen total de aguas servidas
          vertidas en la cuenca del río Coata. Este flujo contaminante se
          origina en centros urbanos, botaderos informales y pasivos mineros. Es
          arrastrada por los ríos de la cuenca hasta acumularse en el lecho del
          lago.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={38}>
        <CoverMessage.Title>BAJO LA SUPERFICIE</CoverMessage.Title>
        <CoverMessage.Subtitle>
          La crisis que esconde el Lago Titicaca
        </CoverMessage.Subtitle>
      </CoverMessage>

      <CoverMessage at={53}>
        <CoverMessage.Paragraph>
          El río Coata y otros afluentes transportan aguas residuales
          domésticas, residuos sólidos y metales pesados hacia el lago Titicaca.
          Esta investigación documenta el avance de la contaminación en Juliaca,
          Coata y las comunidades puneñas, evaluando su impacto directo en la
          biodiversidad, la salud pública y las actividades económicas matrices:
          pesca, ganadería y turismo.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={66}>
        <CoverMessage.Paragraph>
          Recorrimos los puntos críticos de la cuenca para contrastar los datos
          oficiales con la realidad de las comunidades afectadas en Puno. Este
          reporte audiovisual registra el testimonio de los habitantes ribereños
          y la evidencia física de los relaves y vertimientos en el agua.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={84}>
        <CoverMessage.Title>
          ¿Qué esconde el lago más alto del mundo?
        </CoverMessage.Title>
        <div className="pointer-events-auto mt-4 aspect-video w-full max-w-64 overflow-hidden rounded-2xl bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/15 sm:mt-8 sm:max-w-2xl">
          {youTubeId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
              title="Documental Lago Titicaca"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-light text-white/70">
              Video de YouTube — pega el ID en YOUTUBE
            </div>
          )}
        </div>
      </CoverMessage>
    </section>
  );
};
