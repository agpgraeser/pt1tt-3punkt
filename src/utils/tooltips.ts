/**
 * Hilftexte für Eingabefelder.
 * Gleiche Variablennamen → gleiche Texte in allen Projekten.
 * Für neue Projekte: Datei kopieren und projektspezifische Einträge ergänzen.
 */
export const TIPS: Record<string, string> = {
  // ── Regelgröße ────────────────────────────────────────────────────────────
  xA:  'Anfangswert der Regelgröße x vor dem Sprung',
  xE:  'Endwert der Regelgröße x nach dem Sprung (stationärer Endwert)',
  dX:  'Hub der Regelgröße: ΔX = XE − XA',

  // ── Stellgröße ────────────────────────────────────────────────────────────
  yA:  'Anfangswert der Stellgröße y vor dem Sprung',
  yE:  'Endwert der Stellgröße y nach dem Sprung',
  dY:  'Hub der Stellgröße: ΔY = YE − YA',
  DY:  'Änderung der Stellgröße zum Zeitpunkt t₀',

  // ── Zeit ──────────────────────────────────────────────────────────────────
  t0:  'Zeitpunkt der Sprunganregung (Beginn des Eingangshubes)',
  t10: 'Zeitpunkt, zu dem die Regelgröße 10 % des Gesamthubs ΔX erreicht hat',
  t50: 'Zeitpunkt, zu dem die Regelgröße 50 % des Gesamthubs ΔX erreicht hat',
  t90: 'Zeitpunkt, zu dem die Regelgröße 90 % des Gesamthubs ΔX erreicht hat',

  // ── Kennwerte ─────────────────────────────────────────────────────────────
  kS:  'Stationäre Verstärkung: kS = ΔX / ΔY',
  KS:  'Verstärkungsfaktor des Systems: KS = ΔX / ΔY',
  TT:  'Totzeit: Verzögerung bis zum Beginn der messbaren Systemreaktion',
  TG:  'Zeitkonstante der PT1-Antwort (Anstiegsgeschwindigkeit)',

  // ── Hilfswerte 3-Punkt-Methode ────────────────────────────────────────────
  x10: 'Referenzwert für t10: XA + 10 % · ΔX',
  x50: 'Referenzwert für t50: XA + 50 % · ΔX',
  x90: 'Referenzwert für t90: XA + 90 % · ΔX',
};
