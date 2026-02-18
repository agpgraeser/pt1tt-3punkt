import type { PT1TTState, DerivedValues, ValidationErrors } from '../types';

function parseNum(s: string): number | null {
  const v = parseFloat(s);
  return isNaN(v) || !isFinite(v) ? null : v;
}

/**
 * Computes all derived values from current state.
 * Pure function — no side effects.
 */
export function computeDerived(state: PT1TTState): DerivedValues {
  const xA = parseNum(state.xA);
  const xE = parseNum(state.xE);
  const yA = parseNum(state.yA);
  const yE = parseNum(state.yE);
  const t0 = parseNum(state.t0);
  const t10 = parseNum(state.t10);
  const t50 = parseNum(state.t50);
  const t90 = parseNum(state.t90);

  const dX = xA !== null && xE !== null ? xE - xA : null;
  const dY = yA !== null && yE !== null ? yE - yA : null;
  const x10 = xA !== null && dX !== null ? xA + 0.1 * dX : null;
  const x50 = xA !== null && dX !== null ? xA + 0.5 * dX : null;
  const x90 = xA !== null && dX !== null ? xA + 0.9 * dX : null;
  const kS = dX !== null && dY !== null && dY !== 0 ? dX / dY : null;

  let TT: number | null = null;
  let TG: number | null = null;

  // Only compute TT/TG when all time inputs are filled and in valid order
  if (
    t0 !== null && t10 !== null && t50 !== null && t90 !== null &&
    t0 < t10 && t10 < t50 && t50 < t90
  ) {
    const t10_rel = t10 - t0;
    const t50_rel = t50 - t0;
    const t90_rel = t90 - t0;

    TT = (t10_rel - 0.046 * t90_rel) / 0.954;
    const t10_corr = t10_rel - TT;
    const t50_corr = t50_rel - TT;
    const t90_corr = t90_rel - TT;
    TG = (9.491 * t10_corr + 1.443 * t50_corr + 0.434 * t90_corr) / 3;
  }

  let modelData: number[] = [];
  let diffs: number[] = [];
  let diffSquared: number[] = [];

  if (
    xA !== null && dY !== null && kS !== null &&
    TT !== null && TG !== null && TG !== 0 &&
    t0 !== null && state.timeData.length > 0
  ) {
    const tDelay = t0 + TT;
    modelData = state.timeData.map(t => {
      if (t <= tDelay) return xA;
      // Safe to use non-null dY and TG here — checked above
      return xA + kS * (dY as number) * (1 - Math.exp(-(t - tDelay) / (TG as number)));
    });
    diffs = state.xData.map((x, i) => x - modelData[i]);
    diffSquared = diffs.map(d => d * d);
  }

  return { dX, dY, x10, x50, x90, kS, TT, TG, modelData, diffs, diffSquared };
}

/**
 * Returns which input fields currently have validation errors.
 */
export function validateInputs(state: PT1TTState): ValidationErrors {
  const xA = parseNum(state.xA);
  const xE = parseNum(state.xE);
  const yA = parseNum(state.yA);
  const yE = parseNum(state.yE);
  const t0 = parseNum(state.t0);
  const t10 = parseNum(state.t10);
  const t50 = parseNum(state.t50);
  const t90 = parseNum(state.t90);

  return {
    xA: xA === null,
    xE: xE === null,
    yA: yA === null,
    yE: yE === null,
    t0: t0 === null || t0 < 0,
    t10: t10 === null || (t0 !== null && t10 <= t0) || (t50 !== null && t10 >= t50),
    t50: t50 === null || (t0 !== null && t50 <= t0) || (t10 !== null && t50 <= t10) || (t90 !== null && t50 >= t90),
    t90: t90 === null || (t0 !== null && t90 <= t0) || (t50 !== null && t90 <= t50),
  };
}

export function fmt(val: number | null, decimals = 4): string {
  return val !== null ? val.toFixed(decimals) : '';
}
