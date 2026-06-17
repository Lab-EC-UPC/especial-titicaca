import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { initCoverScroll } from "./timeline";
import { CoverMessage } from "./CoverMessage";
import { getYouTubeId } from "./youtube";
import { COVER_BANDS } from "./cover-data";

gsap.registerPlugin(useGSAP);

const YOUTUBE = "KspkzwF-3fY";
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
          de Perú y Bolivia.
          <br />
          <br />
          Hoy, su equilibrio está en riesgo.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={22}>
        <CoverMessage.Paragraph>
          Los ríos que alimentan al Titicaca reciben descargas permanentes de
          aguas residuales, basura y contaminantes. La provincia de San Román
          (Juliaca) concentra más del 87% de las aguas servidas que llegan a la
          cuenca del Coata. A esto se agregan botaderos informales y residuos de
          antiguas actividades mineras. Gran parte de esa contaminación termina
          acumulándose en el lago.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={42}>
        <CoverMessage.Title>BAJO LA SUPERFICIE</CoverMessage.Title>
        <CoverMessage.Subtitle>
          La crisis que esconde el Lago Titicaca
        </CoverMessage.Subtitle>
      </CoverMessage>

      <CoverMessage at={59}>
        <CoverMessage.Paragraph>
          Esta contaminación tiene un impacto directo y preocupante en la salud
          de las personas que viven cerca de los ríos. En las últimas dos
          décadas, se han registrado 987 muertes relacionadas con el consumo de
          agua contaminada en la región, siendo los niños menores de 11 años y
          los adultos mayores los grupos más vulnerables.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={74}>
        <CoverMessage.Paragraph>
          Este documental sigue la ruta de la contaminación desde Juliaca hasta
          el lago Titicaca. Con imágenes aéreas, registros en campo y
          testimonios de especialistas y habitantes de la cuenca, muestra cómo
          el deterioro ambiental afecta al ecosistema más importante del
          altiplano.
        </CoverMessage.Paragraph>
      </CoverMessage>

      <CoverMessage at={92}>
        <h2 className="text-base font-normal leading-[1.15] tracking-tight sm:text-3xl md:text-4xl">
          ¿Cómo llegó el Titicaca a esta situación si sus problemas eran
          conocidos desde hace mucho?
        </h2>
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
