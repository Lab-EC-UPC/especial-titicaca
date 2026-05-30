export default function Leyenda() {
  return (
    <div className="bg-white rounded-4xl shadow-sm max-w-xs px-4 py-6">

      <h3 className="text-center font-inter font-bold text-2xl mb-3 tracking-wide">
        LEYENDA
      </h3>

      <div className="flex gap-8 mx-2 mb-6">
        <span className="bg-gray-200 rounded-full w-full py-1 text-base text-center font-inter font-medium">SALUD</span>
        <span className="bg-gray-200 rounded-full w-full py-1 text-base text-center font-inter font-medium">MINERIA</span>
      </div>

      <ul className="flex flex-col gap-5">
        <li className="flex items-start gap-2 text-xs">
          <span className="h-4 w-8 rounded-full bg-[#00BEB4]" />
          <span className="text-sm font-inter font-medium">(0 - 30 min): Zona segura.</span>
        </li>
        <li className="flex items-start gap-2 text-xs">
          <span className="h-4 w-8 rounded-full bg-[#FFB531]" />
          <span className="text-sm font-inter font-medium">(30 min - 1 hora): Zona de riesgo.</span>
        </li>
        <li className="flex items-start gap-2 text-xs">
          <span className=" h-4 w-8 rounded-full bg-[#E53E3E]" />
          <span className="text-sm font-inter font-medium">(Más de 1 hora): Zona crítica / Abandono.</span>
        </li>
      </ul>

    </div>
  );
}
