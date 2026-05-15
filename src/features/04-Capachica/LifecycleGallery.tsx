import lifecycle1 from "/src/assets/lifecycle/lifecycle-animation-1.gif";
import lifecycle2 from "/src/assets/lifecycle/lifecycle-animation-2.gif";
import lifecycle3 from "/src/assets/lifecycle/lifecycle-animation-3.gif";
import lifecycle4 from "/src/assets/lifecycle/lifecycle-animation-4.gif";
import { useState } from "react";

const gifs: string[] = [lifecycle1, lifecycle2, lifecycle3, lifecycle4];

export const LifecycleGallery = () => {
  const [current, setCurrent] = useState<number>(0);

  const handleClick = () => {
    setCurrent((prev) => (prev + 1) % gifs.length);
  };

  return (
    <div
      className="w-screen h-screen cursor-pointer relative overflow-hidden"
      onClick={handleClick}
    >
      <img
        src={gifs[current]}
        alt={`Lifecycle ${current + 1}`}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {gifs.map((_, i: number) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};