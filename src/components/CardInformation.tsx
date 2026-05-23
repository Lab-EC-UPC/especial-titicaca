interface Props {
  onClose: () => void;
}

export default function CardInformation({ onClose }: Props) {
  return (
    <div className="relative bg-black pr-17 pl-5 pt-3 pb-2 rounded-lg flex flex-col gap-1.5">
      <button className="absolute top-2 right-2 text-white text-[10px] hover:opacity-70" onClick={onClose}>✕</button>
      <h2 className="text-white text-xs font-inter font-bold mb-1">CHUCUITO</h2>
      <p className="text-[10px] font-inter leading-none">
        <span className="text-gray-500">Categoria:</span> <span className="text-gray-300">Centro de Salud (1-3)</span>
      </p>
      <p className="text-[10px] font-inter leading-none max-w-[230px]">
        <span className="text-gray-500">Clasificacion:</span> <span className="text-gray-300">CENTROS DE SALUD O CENTROS MEDICOS</span>
      </p>
      <p className="text-[10px] font-inter leading-none">
        <span className="text-gray-500">Provincia:</span> <span className="text-gray-300">PUNO</span>
      </p>
      <p className="text-[10px] font-inter leading-none">
        <span className="text-gray-500">Distrito:</span> <span className="text-gray-300">Chucuito</span>
      </p>
      <p className="text-[10px] font-inter leading-none">
        <span className="text-gray-500">Estado:</span> <span className="text-green-400">Activo</span>
      </p>
    </div>
  );
}
