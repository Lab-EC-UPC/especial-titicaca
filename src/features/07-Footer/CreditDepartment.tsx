import { CreditGroupItem } from "./CreditGroupItem";
import type { CreditDepartment as CreditDepartmentType } from "./types";

export const CreditDepartment = ({ department }: { department: CreditDepartmentType }) => (
  <section className="flex w-full flex-col items-center">
    <h3
      className="uppercase font-semibold text-white"
      style={{
        fontSize: "clamp(12px, 2.2vw, 22px)",
        letterSpacing: "0.14em",
        marginBottom: "clamp(24px, 4.5vh, 44px)",
      }}
    >
      {department.title}
    </h3>

    <div className="flex w-full flex-col items-center" style={{ gap: "clamp(22px, 4vh, 40px)" }}>
      {department.groups.map((group) => (
        <CreditGroupItem key={group.role || group.names[0]} group={group} />
      ))}
    </div>
  </section>
);
