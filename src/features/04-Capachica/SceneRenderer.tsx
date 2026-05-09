import React from 'react';
import { lerp, clamp, norm, lerpColor } from './mathUtils';

interface SceneProps { t: number; }

export const SceneRenderer: React.FC<SceneProps> = ({ t }) => {
  // background color interpolation
  const bgColor = t < 0.15 ? lerpColor("#cce8f5","#e2efd5",norm(t,0,0.15))
    : t < 0.30 ? lerpColor("#e2efd5","#f0ece0",norm(t,0.15,0.30))
    : t < 0.50 ? lerpColor("#f0ece0","#f2ede8",norm(t,0.30,0.50))
    : t < 0.65 ? lerpColor("#f2ede8","#ede8e0",norm(t,0.50,0.65))
    : t < 0.82 ? lerpColor("#ede8e0","#e8e0d8",norm(t,0.65,0.82))
    : lerpColor("#e8e0d8","#e0d8ce",norm(t,0.82,1.0));

  // environment states
  const mtOpacity = clamp(norm(t, 0.28, 0.48), 0, 0.52);
  const waterOpacity = clamp(1 - norm(t, 0.18, 0.38), 0, 1) * 0.72;
  const groundY = lerp(338, 372, clamp(norm(t, 0, 0.32), 0, 1));
  const droop = clamp(norm(t, 0, 0.28), 0, 1);
  const totColor = lerpColor("#2d5a2d", "#7a6a20", droop);
  const totOpacity = clamp(1 - norm(t, 0.30, 0.52), 0, 1);

  // sheep logic
  const sheepVisible = t > 0.08 && t < 0.73;
  const sheepX = t < 0.12 ? lerp(-100, 120, norm(t, 0.08, 0.12)) : t < 0.22 ? lerp(120, 300, norm(t, 0.12, 0.22)) : t < 0.30 ? 300 : t < 0.55 ? lerp(300, 545, norm(t, 0.30, 0.55)) : 545;
  const sheepY = lerp(340, 355, clamp(norm(t, 0.30, 0.58), 0, 1));
  const isEating = t >= 0.18 && t <= 0.32;
  const isWeakWalk = t >= 0.33 && t < 0.58;
  const isLying = t >= 0.58 && t < 0.73;
  const sheepOpacity = isLying ? clamp(1 - norm(t, 0.68, 0.73), 0, 1) : 1;
  const tearOpacity = clamp(norm(t, 0.38, 0.46), 0, 1) * clamp(1 - norm(t, 0.60, 0.68), 0, 1);
  const leg1d = isWeakWalk ? Math.abs(Math.sin(sheepX * 0.08)) * 14 : 0;
  const leg2d = isWeakWalk ? Math.abs(Math.cos(sheepX * 0.08)) * 12 : 0;

  // villager logic
  const villagerVisible = t >= 0.55;
  const villagerX = t < 0.60 ? lerp(820, 430, norm(t, 0.55, 0.60)) : t < 0.67 ? 430 : lerp(430, 760, norm(t, 0.67, 0.95));
  const isSacrificing = t >= 0.59 && t < 0.68;
  const sickness = clamp(norm(t, 0.68, 1.0), 0, 1);
  const hunch = lerp(0, 22, sickness);
  const stomachT = clamp(norm(t, 0.72, 0.84), 0, 1);
  const painOpacity = clamp(norm(t, 0.76, 0.88), 0, 1);

  return (
    <svg 
      viewBox="0 0 800 450" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* background layer */}
      <rect width="800" height="450" fill={bgColor} />

      {/* sun with glow effect */}
      <circle cx="698" cy="72" r="42" fill="#f5c842" opacity={clamp(1 - norm(t, 0.22, 0.48), 0.15, 0.92)} />
      <circle cx="698" cy="72" r="60" fill="#f5c842" opacity={clamp((1 - norm(t, 0.22, 0.48)) * 0.18, 0, 0.18)} />

      {/* mountain paths */}
      <path d="M0 310 L195 152 L415 292 L618 126 L800 266 L800 450 L0 450Z" fill="#b0a098" opacity={mtOpacity} />
      <path d="M0 310 L195 152 L415 292 L618 126 L800 266 L800 450 L0 450Z" fill="none" stroke="#8a7870" strokeWidth="1.5" opacity={mtOpacity * 1.6} />

      {/* water surface */}
      {waterOpacity > 0.01 && (
        <g opacity={waterOpacity}>
          <ellipse cx="155" cy="392" rx="195" ry="54" fill="#a8c8d8" />
          <ellipse cx="138" cy="402" rx="158" ry="40" fill="#8fb8cc" opacity={0.65} />
          {[92, 122, 152].map((x, i) => (
            <rect key={i} x={x} y={374 + i * 5} width="15" height="9" rx="2" fill="#8B7355" opacity={0.82} />
          ))}
        </g>
      )}

      {/* ground layers */}
      <path d={`M0 ${groundY} Q200 ${groundY - 28} 400 ${groundY - 12} Q600 ${groundY + 8} 800 ${groundY - 20} L800 450 L0 450Z`} fill="#5a7a5a" />
      <path d={`M0 ${groundY + 18} Q250 ${groundY - 4} 550 ${groundY + 10} L800 ${groundY - 4} L800 450 L0 450Z`} fill="#4a6a4a" />

      {/* totora reeds */}
      {totOpacity > 0.01 && [52, 102, 152, 200, 250].map((x, i) => {
        const tx = x - 8 + i * 3 + droop * 22;
        const ty = 200 + droop * 42;
        return (
          <g key={i} opacity={totOpacity}>
            <line x1={x} y1={groundY} x2={tx} y2={ty} stroke={totColor} strokeWidth="3" />
            <line x1={x + 16} y1={groundY} x2={tx + 18} y2={ty - 12} stroke={totColor} strokeWidth="2.5" />
            {droop > 0.3 && <path d={`M${tx} ${ty} Q${tx + 12} ${ty + 20} ${tx + 8} ${ty + 36}`} fill="none" stroke="#8a6a20" strokeWidth="2" />}
          </g>
        );
      })}

      {/* initial pollution cloud */}
      {t < 0.20 && (
        <g opacity={clamp(1 - norm(t, 0.10, 0.20), 0, 0.33)}>
          <ellipse cx="345" cy="178" rx="73" ry="31" fill="#aec890" />
          <ellipse cx="318" cy="172" rx="50" ry="27" fill="#9eb880" opacity={0.6} />
        </g>
      )}

      {/* sheep rendering */}
      {sheepVisible && (
        <g transform={`translate(${sheepX},${sheepY}) rotate(${isLying ? lerp(0, 28, norm(t, 0.60, 0.68)) : 0}, 0,0)`} opacity={sheepOpacity}>
          <ellipse cx="0" cy="62" rx="84" ry="9" fill="#3a5a3a" opacity="0.16" />
          <ellipse cx="0" cy="0" rx="88" ry={isLying ? 36 : 50} fill="#f0ebe3" stroke="#7a5555" strokeWidth="2.5" />
          {[-55, -28, 0, 28, 55].map((dx, i) => (
            <ellipse key={i} cx={dx} cy={-8 + (i % 2) * 9} rx="18" ry="12" fill="none" stroke="#c8c0b0" strokeWidth="1.5" />
          ))}
          <ellipse cx="-76" cy="-8" rx="18" ry="13" fill="#f0ebe3" stroke="#7a5555" strokeWidth="2" />
          {!isLying && (
            <g transform={isEating ? "translate(88,30) rotate(22)" : isWeakWalk ? "translate(86,24) rotate(14)" : "translate(86,10)"}>
              <ellipse cx="0" cy="0" rx="36" ry="28" fill="#f0ebe3" stroke="#7a5555" strokeWidth="2.5" />
              <ellipse cx="18" cy="10" rx="16" ry="11" fill="#e8ddd0" stroke="#7a5555" strokeWidth="2" />
              <circle cx="-2" cy="-6" r="4" fill="#5a3535" />
              {tearOpacity > 0 && <path d="M-2 -2 Q-5 9 -7 19" fill="none" stroke="#6a8aaa" strokeWidth="2" opacity={tearOpacity} />}
              <ellipse cx="-15" cy="-17" rx="9" ry="15" fill="#e0d0c0" stroke="#7a5555" strokeWidth="2" transform="rotate(-20 -15 -17)" />
            </g>
          )}
          {isLying ? (
            <>
              <line x1="-42" y1="34" x2="-52" y2="57" stroke="#7a5555" strokeWidth="5" strokeLinecap="round" />
              <line x1="54" y1="34" x2="62" y2="57" stroke="#7a5555" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="-52" y1="48" x2="-54" y2={86 + leg1d} stroke="#7a5555" strokeWidth="6" strokeLinecap="round" />
              <line x1="-22" y1="50" x2="-24" y2={84 - leg2d} stroke="#7a5555" strokeWidth="6" strokeLinecap="round" />
              <line x1="18" y1="50" x2="20" y2={84 + leg2d} stroke="#7a5555" strokeWidth="6" strokeLinecap="round" />
              <line x1="48" y1="48" x2={isWeakWalk ? 60 : 50} y2={isWeakWalk ? 72 + leg1d : 86} stroke="#7a5555" strokeWidth="6" strokeLinecap="round" />
            </>
          )}
        </g>
      )}

      {/* villager rendering */}
      {villagerVisible && (
        <g transform={`translate(${villagerX},300)`}>
          <ellipse cx="20" cy="140" rx="44" ry="8" fill="#3a5a3a" opacity="0.17" />
          <g transform={`rotate(${hunch},20,80)`}>
            <rect x="5" y="55" width="32" height="78" rx="8" fill="#e0d4c4" stroke="#6a5a50" strokeWidth="2" />
          </g>
          <circle cx={20 + sickness * 6} cy={44 - sickness * 9} r="24" fill="#d4b896" stroke="#6a5a50" strokeWidth="2" />
          <ellipse cx={20 + sickness * 6} cy={25 - sickness * 9} rx="29" ry="8" fill="#8a7060" />
          <rect x={-5 + sickness * 6} y={13 - sickness * 9} width="50" height="16" rx="4" fill="#7a6050" />
          <circle cx={12 + sickness * 6} cy={41 - sickness * 9} r="3" fill="#4a2a2a" />
          <circle cx={28 + sickness * 6} cy={41 - sickness * 9} r="3" fill="#4a2a2a" />
          <path d={`M${12 + sickness * 6} ${51 - sickness * 9} Q${20 + sickness * 6} ${51 - sickness * 9 + lerp(0, 9, sickness)} ${28 + sickness * 6} ${51 - sickness * 9}`} fill="none" stroke="#6a4a40" strokeWidth="2" />
          {isSacrificing ? (
            <g>
              <path d="M8 70 Q-22 102 -12 142" fill="none" stroke="#6a5a50" strokeWidth="8" strokeLinecap="round" />
              <path d="M32 70 Q60 102 52 140" fill="none" stroke="#6a5a50" strokeWidth="8" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <path d={`M8 72 Q${lerp(-14, -32, sickness)} ${lerp(102, 90, sickness)} ${lerp(-4, -22, sickness)} ${lerp(132, 114, sickness)}`} fill="none" stroke="#6a5a50" strokeWidth="8" strokeLinecap="round" />
              <path d={`M32 72 Q${lerp(56, 38, stomachT)} ${lerp(102, 94, stomachT)} ${lerp(48, 32, stomachT)} ${lerp(132, 100, stomachT)}`} fill="none" stroke="#6a5a50" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}
          <rect x="8" y="130" width="14" height={54 + sickness * 6} rx="6" fill="#6a7a8a" stroke="#5a6a7a" strokeWidth="1.5" transform={`rotate(${lerp(0, 9, sickness)},15,133)`} />
          <rect x="26" y="130" width="14" height={53 + sickness * 6} rx="6" fill="#6a7a8a" stroke="#5a6a7a" strokeWidth="1.5" transform={`rotate(${lerp(0, -6, sickness)},33,133)`} />
          <ellipse cx="14" cy="188" rx="13" ry="7" fill="#4a3a30" />
          <ellipse cx="32" cy="188" rx="13" ry="7" fill="#4a3a30" />
          {sickness > 0.48 && [0, 1, 2].map(i => (
            <circle key={i} cx={55 + i * 14} cy={84 - i * 6} r={5 + i * 3} fill="none" stroke="#c06030" strokeWidth="1.5" opacity={painOpacity * (0.65 - i * 0.12)} />
          ))}
          {sickness > 0.72 && <text x="68" y="50" fontSize="24" fill="#c04040" opacity={clamp(norm(sickness, 0.72, 0.90), 0, 0.75)}>✗</text>}
        </g>
      )}
    </svg>
  );
};