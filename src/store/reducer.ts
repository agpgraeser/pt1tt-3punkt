import type { PT1TTState, ShowMode, ExcelParseResult } from '../types';

export type Action =
  | { type: 'SET_FIELD'; field: 'xA' | 'xE' | 'yA' | 'yE' | 't0' | 't10' | 't50' | 't90'; value: string }
  | { type: 'SET_SHOW_MODE'; mode: ShowMode }
  | { type: 'LOAD_EXCEL'; result: ExcelParseResult; fileName: string };

export const initialState: PT1TTState = {
  xA: '0',
  xE: '1',
  yA: '0',
  yE: '1',
  t0: '0',
  t10: '0',
  t50: '0',
  t90: '0',
  showMode: 1,
  timeData: [],
  xData: [],
  yData: [],
  systemName: '',
  varNames: { time: 'Zeit', x: 'X', y: 'Y' },
  units: { time: '', x: '', y: '' },
  fileName: '',
  excelPreviewRows: [],
};

export function reducer(state: PT1TTState, action: Action): PT1TTState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SHOW_MODE':
      return { ...state, showMode: action.mode };
    case 'LOAD_EXCEL':
      return {
        ...state,
        timeData: action.result.timeData,
        xData: action.result.xData,
        yData: action.result.yData,
        systemName: action.result.systemName,
        varNames: action.result.varNames,
        units: action.result.units,
        fileName: action.fileName,
        excelPreviewRows: action.result.previewRows,
      };
    default:
      return state;
  }
}
