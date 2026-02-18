<!-- .github/copilot-instructions.md -->
# Copilot instructions — PT1TT_Berechnung

Purpose: Provide concise, actionable guidance so an AI coding agent becomes productive quickly in this repository.

- **Project shape**: single-page static web app. Main UI and logic live in [PT1TT_layout.html](PT1TT_layout.html). There is no build system, package.json, or tests checked in.

- **How to run locally**:
  - Open [PT1TT_layout.html](PT1TT_layout.html) directly in a browser for quick inspection.
  - For reliable behavior (CORS, file loading), run a minimal static server from the repo root, e.g.:

```powershell
# from f:\Dropbox\1_a_a_WebApp\PT1TT_Berechnung
python -m http.server 8000
# then open http://localhost:8000/PT1TT_layout.html
```

- **Primary responsibilities for code changes**:
  - Preserve single-file behavior: UI, parsing, model, and plot are colocated in [PT1TT_layout.html](PT1TT_layout.html).
  - Keep external dependencies via CDN (Plotly, xlsx) unless the user requests packaging.
  - Avoid introducing heavy build tooling unless requested.

- **Key code patterns & examples (search and modify safely)**:
  - DOM-driven UI: input elements have stable `id` attributes such as `XA`, `XE`, `t0`, `t10`, etc. (see [PT1TT_layout.html](PT1TT_layout.html)).
  - Global state arrays: `timeData`, `xData`, `yData` hold parsed Excel values and are used across functions.
  - Parser variants: `parseExcelStructure(rows)` recognizes three structures: "C" (3 header rows) and A/B (1 or 0 header rows). Use this function when updating or extending Excel handling.
  - Plotting: `plotData()` assembles traces and shapes then calls `Plotly.newPlot("plotArea", ...)`.
  - Model computation: `computeModelResponse()` uses `kS`, `TT`, `TG`, `t0` and global state to produce the model trace.
  - Input validation/UX: `isValidNumber`, `updateFieldStyle`, and `invalid` CSS class are used consistently to indicate bad values.

- **Excel import specifics**:
  - File input accepts `.xlsx` and `.xls` via `<input id="excelFile">` and uses the `xlsx` CDN library to read the first sheet.
  - `parseExcelStructure` extracts `systemName`, `varNames`, and `units` when header rows are present; otherwise it assumes columns `Zeit | X | Y`.

- **Conventions to follow when modifying code**:
  - Keep function names and responsibilities small and clear (existing functions like `updateDX`, `updateDY`, `updateTimeOrder`, `updateDerivedValues`, `computeModelResponse`, `plotData`).
  - Preserve public `id` attributes in the DOM — other code depends on them.
  - When adding features, prefer adding small helper functions and keeping DOM wiring via `addEventListener` rather than inline handlers.

- **Integration points & external deps**:
  - Plot library: Plotly loaded from CDN `https://cdn.plot.ly/plotly-*.min.js`.
  - Excel parsing: `https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js`.
  - Both are referenced near the end of [PT1TT_layout.html](PT1TT_layout.html) and expected to be globally available.

- **What is not present / must be asked**:
  - No CI, tests, or lint rules detected. Ask the repo owner if they want tests, TypeScript, or packaging.
  - No canonical sample data included — ask for representative Excel files to create integration tests or sample fixtures.

- **When to propose bigger changes**:
  - If adding unit tests or bundling, first confirm with the user whether to convert the single-file layout into modular JS files and introduce a package manager.

If anything here is unclear or you want additional points (CI, tests, sample Excel), tell me which I should add or expand. I'll iterate. 
