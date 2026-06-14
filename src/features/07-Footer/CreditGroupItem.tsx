import type { CSSProperties } from "react";
import type { CreditGroup } from "./types";

const namesLayout = (columns?: number): CSSProperties =>
  columns
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: "clamp(8px, 5vw, 56px)",
        rowGap: 6,
        justifyItems: "center",
      }
    : { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 };

export const CreditGroupItem = ({ group }: { group: CreditGroup }) => (
  <div className="flex flex-col items-center" style={{ gap: 6 }}>
    {group.role && (
      <p
        className="uppercase font-light"
        style={{
          fontSize: "clamp(8px, 1.2vw, 13px)",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {group.role}
      </p>
    )}
    <div style={namesLayout(group.columns)}>
      {group.names.map((name) => (
        <p
          key={name}
          className="font-medium text-white"
          style={{
            fontSize: "clamp(9px, 2vw, 20px)",
            letterSpacing: "0.03em",
            lineHeight: 1.35,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
      ))}
    </div>
  </div>
);
