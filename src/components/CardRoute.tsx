import { type ReactNode } from "react";

interface Props {
  number: number;
  color: string;
  className?: string;
  onNext?: () => void;
  children: ReactNode;
}

export default function CardRoute({ number, color, className = "", onNext, children }: Props) {
  return (
    <div className={`relative pt-5 ${onNext ? "pb-5" : ""} ${className}`}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-13 h-10 flex items-center justify-center z-10"
        style={{ backgroundColor: color }}
      >
        <span
          className="font-elza font-bold text-lg leading-none"
          style={{ color: color === "#FFFFFF" ? "#21292C" : "#FFFFFF" }}
        >
          {number}
        </span>
      </div>

      <div
        className="bg-[#21292C]/50 px-4 pt-8 pb-5 text-white font-elza text-sm text-center leading-snug"
        style={{ border: `3px solid ${color}` }}
      >
        {children}
      </div>

      {onNext && (
        <button
          onClick={onNext}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg width="40" height="40" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="29" cy="29" r="29" fill="white"/>
            <path d="M32.3687 29.0029L20.3481 41.0234L20.0298 41.3408L19.7114 41.0234L16.9614 38.2734L16.644 37.9551L16.9614 37.6367L25.5767 29.002L16.9614 20.3682L16.644 20.0508L16.9614 19.7324L20.0298 16.6641L32.3687 29.0029Z" fill="#354046" stroke="#354046" strokeWidth="0.9"/>
            <rect x="36.5422" y="16.8508" width="4.63055" height="24.3041" fill="#354046" stroke="#354046" strokeWidth="0.9"/>
          </svg>
        </button>
      )}
    </div>
  );
}
