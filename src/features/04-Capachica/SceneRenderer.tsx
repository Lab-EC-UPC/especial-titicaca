import React from "react";

// loads all frame images
const imagesMap = import.meta.glob(
  "/src/assets/CicloContagioFrames/*.{png,jpg,jpeg,PNG,JPG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// sorts frames numerically
const frames = Object.entries(imagesMap)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");

    return numA - numB;
  })
  .map(([, value]) => value as string);

interface SceneProps {
  frameIndex: number;
}

export const SceneRenderer: React.FC<SceneProps> = ({ frameIndex }) => {
  // current frame image
  const currentImage = frames[frameIndex];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {currentImage && (
        <img
          src={currentImage}
          alt={`Frame ${frameIndex + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}
    </div>
  );
};