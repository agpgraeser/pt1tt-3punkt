export type ShowMode = 1 | 2 | 3 | 4;

export interface VarNames {
  time: string;
  x: string;
  y: string | null;
}

export interface Units {
  time: string;
  x: string;
  y: string;
}

export interface PT1TTState {
  // User inputs (stored as strings to allow free typing in number inputs)
  xA: string;
  xE: string;
  yA: string;
  yE: string;
  t0: string;
  t10: string;
  t50: string;
  t90: string;
  showMode: ShowMode;
  // Excel data
  timeData: number[];
  xData: number[];
  yData: number[];
  systemName: string;
  varNames: VarNames;
  units: Units;
  fileName: string;
  excelPreviewRows: (string | number | undefined)[][];
  displayMode: number;
}

export interface DerivedValues {
  dX: number | null;
  dY: number | null;
  x10: number | null;
  x50: number | null;
  x90: number | null;
  kS: number | null;
  TT: number | null;
  TG: number | null;
  modelData: number[];
  diffs: number[];
  diffSquared: number[];
  cumSum: number[];
  cumSumTotal: number | null;
}

export interface ExcelParseResult {
  timeData: number[];
  xData: number[];
  yData: number[];
  systemName: string;
  varNames: VarNames;
  units: Units;
  previewRows: (string | number | undefined)[][];
}

export interface ValidationErrors {
  xA: boolean;
  xE: boolean;
  yA: boolean;
  yE: boolean;
  t0: boolean;
  t10: boolean;
  t50: boolean;
  t90: boolean;
}
