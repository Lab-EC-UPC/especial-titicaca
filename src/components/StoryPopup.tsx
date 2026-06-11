
interface StoryPopupProps {
  onShowRoute: () => void;
}

export default function StoryPopup({ onShowRoute }: StoryPopupProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-4 md:px-10">
      {/* Card */}
      <div
        className="relative w-full max-w-7xl rounded-lg flex flex-col items-center justify-center mt-16 md:mt-30 bg-[#21292C]/50 border-2 md:border-4 border-[#C03A84]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Avatar */}
        <div className="absolute -top-10 md:-top-23 left-1/2 -translate-x-1/2 h-20 w-20 md:h-40 md:w-40 rounded-full overflow-hidden flex-shrink-0 border-2 md:border-4 border-[#C03A84]">
          <img
            src="/src/assets/images/Capachica/TriangulacionSection/campesino-new.png"
            alt="Arturo Ticona"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title */}
        <p className="font-citizen font-light text-base md:text-2xl text-white text-center px-4 pt-14 md:pt-25 pb-4 md:pb-10">
          Arturo Ticona: A 13 Kilómetros del olvido
        </p>

        {/* Body */}
        <div className="font-elza font-light text-sm md:text-xl flex flex-col gap-4 md:gap-5 px-4 lg:px-45 pb-12 md:pb-20 text-center text-white">
          <p>
            Para Arturo Ticona, el agua del río Coata dejó de ser fuente de vida para convertirse en el origen de una enfermedad renal irreversible. "Los doctores me dijeron que no tiene cura", lamenta. Sin recursos para un trasplante, sobrevive con tratamientos para controlar síntomas que antes lo paralizaban por completo. La enfermedad lo llevó a gastar más de mil soles semanales, una crisis que solo se alivió al acceder al SIS. Aunque hoy su medicación es gratuita, acudir a atenderse le sigue exigiendo un enorme desgaste físico.
          </p>
          <p>
            Sin transporte en su comunidad, Arturo debe caminar casi tres horas para recorrer 13 kilómetros a más de 3,800 metros de altitud. No está solo: en la posta se cruza con otros enfermos en su misma situación. "Los veo... como yo, así están", relata. Su drama refleja a las 347 localidades de Puno que enfrentan un aislamiento similar, donde la salud se sigue midiendo en horas de camino.
          </p>
        </div>

        {/* Button */}
        <button
          className="font-citizen font-bold text-base md:text-2xl absolute -bottom-6 md:-bottom-9 left-1/2 -translate-x-1/2 px-8 md:px-14 py-2 md:py-3 rounded-sm text-white whitespace-nowrap bg-[#C03A84] cursor-pointer"
          onClick={onShowRoute}
        >
          Ver su ruta
        </button>
      </div>
    </div>
  );
}
