import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js';
import type { PT1TTState, DerivedValues } from '../types';

interface Props {
  state: PT1TTState;
  derived: DerivedValues;
}

export default function ResponseChart({ state, derived }: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  // Handle resize
  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const observer = new ResizeObserver(() => Plotly.Plots.resize(div));
    observer.observe(div);
    return () => {
      observer.disconnect();
      Plotly.purge(div);
    };
  }, []);

  // Redraw whenever state or derived values change
  useEffect(() => {
    const div = divRef.current;
    if (!div || state.timeData.length === 0) return;

    const { timeData, xData, yData, showMode, fileName, varNames } = state;
    const { modelData, diffs, diffSquared, x10, x50, x90 } = derived;

    const xa = parseFloat(state.xA);
    const xe = parseFloat(state.xE);
    const t0v = parseFloat(state.t0);
    const t10v = parseFloat(state.t10);
    const t50v = parseFloat(state.t50);
    const t90v = parseFloat(state.t90);
    const x10v = x10 ?? 0;
    const x50v = x50 ?? 0;
    const x90v = x90 ?? 0;

    const tMin = Math.min(...timeData);
    const tMax = Math.max(...timeData);

    // --- Traces ---
    const traceX: Plotly.Data = {
      x: timeData, y: xData,
      mode: 'lines', name: 'Messwert X',
      line: { width: 2, color: 'blue' },
      xaxis: 'x', yaxis: 'y',
    };

    const traceModel: Plotly.Data = {
      x: timeData, y: modelData,
      mode: 'lines', name: 'Modellantwort',
      line: { width: 3, color: 'red', dash: 'dot' },
      xaxis: 'x', yaxis: 'y',
    };

    const traceY: Plotly.Data = {
      x: timeData, y: yData,
      mode: 'lines', name: 'Eingang Y',
      line: { width: 2, color: 'green' },
      xaxis: 'x2', yaxis: 'y2',
    };

    const traceDiff: Plotly.Data = {
      x: timeData, y: diffs,
      mode: 'lines', name: 'Abweichung Δx(t)',
      line: { color: 'red', width: 2 },
      xaxis: 'x2', yaxis: 'y2',
    };

    const traceDiffsqr: Plotly.Data = {
      x: timeData, y: diffSquared,
      mode: 'lines', name: 'Δx²(t)',
      line: { color: 'red', width: 2 },
      xaxis: 'x2', yaxis: 'y2',
    };

    let traces: Plotly.Data[];
    let y2title: string;

    if (showMode === 1) {
      traces = [traceX, traceModel, traceY];
      y2title = 'Stellgröße y(t)';
    } else if (showMode === 2) {
      traces = [traceX, traceModel, traceDiff];
      y2title = 'Abweichung Δx(t)';
    } else {
      traces = [traceX, traceModel, traceDiffsqr];
      y2title = 'Δx²(t)';
    }

    // --- Reference line shapes (first subplot only) ---
    const shapes: Partial<Plotly.Shape>[] = [
      // Vertical line at t0
      {
        type: 'line', x0: t0v, x1: t0v, y0: xa, y1: xe,
        xref: 'x', yref: 'y',
        line: { color: 'orange', width: 2, dash: 'dot' },
      },
      // Horizontal lines XA / XE
      {
        type: 'line', x0: tMin, x1: tMax, y0: xa, y1: xa,
        xref: 'x', yref: 'y',
        line: { color: 'red', width: 2, dash: 'dash' },
      },
      {
        type: 'line', x0: tMin, x1: tMax, y0: xe, y1: xe,
        xref: 'x', yref: 'y',
        line: { color: 'red', width: 2, dash: 'dash' },
      },
      // Horizontal lines X10 / X50 / X90
      {
        type: 'line', x0: tMin, x1: t10v, y0: x10v, y1: x10v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
      {
        type: 'line', x0: tMin, x1: t50v, y0: x50v, y1: x50v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
      {
        type: 'line', x0: tMin, x1: t90v, y0: x90v, y1: x90v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
      // Vertical lines t10 / t50 / t90
      {
        type: 'line', x0: t10v, x1: t10v, y0: xa, y1: x10v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
      {
        type: 'line', x0: t50v, x1: t50v, y0: xa, y1: x50v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
      {
        type: 'line', x0: t90v, x1: t90v, y0: xa, y1: x90v,
        xref: 'x', yref: 'y',
        line: { color: 'green', width: 1, dash: 'dash' },
      },
    ];

    // --- Annotations ---
    const annotations: Partial<Plotly.Annotations>[] = [
      { x: t0v,  y: xa, xref: 'x', yref: 'y', text: 't₀',  showarrow: false, yshift: -18, font: { size: 12, color: 'orange' } },
      { x: t10v, y: xa, xref: 'x', yref: 'y', text: 't10', showarrow: false, yshift: -18, font: { size: 12, color: 'blue' } },
      { x: t50v, y: xa, xref: 'x', yref: 'y', text: 't50', showarrow: false, yshift: -18, font: { size: 12, color: 'blue' } },
      { x: t90v, y: xa, xref: 'x', yref: 'y', text: 't90', showarrow: false, yshift: -18, font: { size: 12, color: 'blue' } },
    ];

    const layout: Partial<Plotly.Layout> = {
      title: { text: fileName || 'PT1TT – Zeitverläufe', y: 0.97 },
      grid: {
        rows: 2, columns: 1,
        roworder: 'top to bottom',
        pattern: 'independent',
        heights: [0.67, 0.33],
        ygap: 0.05,
      } as Plotly.Layout['grid'],
      xaxis:  { title: { text: varNames.time || 'Zeit' } },
      yaxis:  { title: { text: varNames.x    || 'x(t)' } },
      xaxis2: { title: { text: varNames.time || 'Zeit' } },
      yaxis2: { title: { text: y2title } },
      shapes,
      annotations,
      margin: { t: 50, r: 20, b: 40, l: 60 },
      autosize: true,
    };

    Plotly.react(div, traces, layout, { responsive: true });
  }, [state, derived]);

  return (
    <div
      ref={divRef}
      style={{ width: '100%', height: '100%', background: '#fafafa' }}
    />
  );
}
