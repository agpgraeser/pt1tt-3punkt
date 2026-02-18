import {
  Box, Typography, Divider, TextField,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import type { Action } from '../store/reducer';
import type { PT1TTState, DerivedValues, ShowMode } from '../types';
import { validateInputs, fmt } from '../utils/pt1ttMath';
import ExcelImport from './ExcelImport';

interface Props {
  state: PT1TTState;
  derived: DerivedValues;
  dispatch: React.Dispatch<Action>;
}

// ── Inline helpers ────────────────────────────────────────────────────────────

function NumInput({
  value, onChange, readOnly = false, error = false, step,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  error?: boolean;
  step?: number;
}) {
  return (
    <TextField
      value={value}
      onChange={e => onChange?.(e.target.value)}
      type="number"
      size="small"
      error={error && !readOnly}
      inputProps={{
        readOnly,
        step,
        style: { textAlign: 'right', fontSize: '0.82rem', padding: '5px 8px' },
      }}
      sx={{
        '& .MuiInputBase-root': {
          backgroundColor: readOnly ? '#e5f7e5' : undefined,
        },
        '& .MuiOutlinedInput-notchedOutline': readOnly
          ? { borderColor: '#b2d8b2 !important' }
          : {},
      }}
    />
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}
    >
      {children}
    </Typography>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, fontSize: '0.82rem' }}>
      {children}
    </Typography>
  );
}

// 6-column compact grid: label | input | label | input | label | input
const row6: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 85px auto 85px auto 85px',
  columnGap: 4,
  rowGap: 4,
  alignItems: 'center',
};

// 4-column compact grid: label | input | label | input
const row4: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 85px auto 85px',
  columnGap: 4,
  rowGap: 4,
  alignItems: 'center',
};

// 2-column: label | input
const row2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 85px',
  columnGap: 4,
  alignItems: 'center',
};

// ── Main component ────────────────────────────────────────────────────────────

export default function ParameterPanel({ state, derived, dispatch }: Props) {
  const errors = validateInputs(state);

  function setField(field: Action & { type: 'SET_FIELD' } extends { field: infer F } ? F : never, value: string) {
    dispatch({ type: 'SET_FIELD', field, value });
  }

  return (
    <Box
      sx={{
        background: '#fff',
        boxShadow: '2px 0 4px rgba(0,0,0,0.06)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        height: '100vh',
      }}
    >
      {/* ── Section 1: Signal bounds ── */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <SectionTitle>PT1TT-Parameter berechnen</SectionTitle>

        <Box sx={row6}>
          <Lbl>XA</Lbl>
          <NumInput value={state.xA} step={0.01} error={errors.xA}
            onChange={v => setField('xA', v)} />
          <Lbl>XE</Lbl>
          <NumInput value={state.xE} step={0.01} error={errors.xE}
            onChange={v => setField('xE', v)} />
          <Lbl>DX</Lbl>
          <NumInput value={fmt(derived.dX, 2)} readOnly />
        </Box>

        <Box sx={{ ...row6, mt: '4px' }}>
          <Lbl>YA</Lbl>
          <NumInput value={state.yA} step={0.01} error={errors.yA}
            onChange={v => setField('yA', v)} />
          <Lbl>YE</Lbl>
          <NumInput value={state.yE} step={0.01} error={errors.yE}
            onChange={v => setField('yE', v)} />
          <Lbl>DY</Lbl>
          <NumInput value={fmt(derived.dY, 2)} readOnly />
        </Box>

        <Box sx={{ ...row2, mt: '4px' }}>
          <Lbl>t₀</Lbl>
          <NumInput value={state.t0} step={0.1} error={errors.t0}
            onChange={v => setField('t0', v)} />
        </Box>
      </Box>

      <Divider />

      {/* ── Section 2: Three-point method ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <SectionTitle>ZPK / 3-Punkt Methode</SectionTitle>

        <Box sx={row4}>
          <Lbl>X10</Lbl>
          <NumInput value={fmt(derived.x10, 2)} readOnly />
          <Lbl>t10</Lbl>
          <NumInput value={state.t10} step={0.01} error={errors.t10}
            onChange={v => setField('t10', v)} />

          <Lbl>X50</Lbl>
          <NumInput value={fmt(derived.x50, 2)} readOnly />
          <Lbl>t50</Lbl>
          <NumInput value={state.t50} step={0.01} error={errors.t50}
            onChange={v => setField('t50', v)} />

          <Lbl>X90</Lbl>
          <NumInput value={fmt(derived.x90, 2)} readOnly />
          <Lbl>t90</Lbl>
          <NumInput value={state.t90} step={0.01} error={errors.t90}
            onChange={v => setField('t90', v)} />
        </Box>
      </Box>

      <Divider />

      {/* ── Section 3: Derived parameters ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <SectionTitle>Berechnete Kennwerte</SectionTitle>

        <Box sx={row6}>
          <Lbl>kS</Lbl>
          <NumInput value={fmt(derived.kS, 4)} readOnly />
          <Lbl>TT</Lbl>
          <NumInput value={fmt(derived.TT, 3)} readOnly />
          <Lbl>TG</Lbl>
          <NumInput value={fmt(derived.TG, 3)} readOnly />
        </Box>
      </Box>

      <Divider />

      {/* ── Section 4: Excel import ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <SectionTitle>Messdaten laden</SectionTitle>
        <ExcelImport state={state} dispatch={dispatch} />
      </Box>

      <Divider />

      {/* ── Section 5: Display mode ── */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <SectionTitle>Darstellung</SectionTitle>
        <ToggleButtonGroup
          value={state.showMode}
          exclusive
          onChange={(_e, val: ShowMode | null) => {
            if (val !== null) dispatch({ type: 'SET_SHOW_MODE', mode: val });
          }}
          size="small"
          sx={{ '& .MuiToggleButton-root': { fontSize: '0.78rem', px: 1.2, py: 0.4 } }}
        >
          <ToggleButton value={1}>Stellgröße</ToggleButton>
          <ToggleButton value={2}>Abweichung</ToggleButton>
          <ToggleButton value={3}>Δx²</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
