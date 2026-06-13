export type CreditGroup = {
  role: string;
  names: string[];
  columns?: number; // si se define, los nombres se muestran en N columnas
};

export type CreditDepartment = {
  title: string;
  groups: CreditGroup[];
};
