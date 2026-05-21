import { useState, useEffect, useRef } from "react";
import StoryPopup from "../../components/StoryPopup";

export const TriangulacionSection = () => {
  const [showStory, setShowStory] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStory(true);
        } else {
          setShowStory(false);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} id="triangulacion" className="bg-violet-200">
      <div className="mx-auto container w-full h-screen">
        {showStory && <StoryPopup onClose={() => setShowStory(false)} />}
      </div>
    </div>
  );
}
  