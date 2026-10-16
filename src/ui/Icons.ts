/**
 * SVG Icon library — lightweight inline SVG icons replacing all emoji usage.
 * Each function returns an SVG string safe for innerHTML insertion.
 */

const s = (paths: string, vb = '0 0 24 24', w = 20, h = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const sf = (paths: string, vb = '0 0 24 24', w = 20, h = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="currentColor">${paths}</svg>`;

export const Icons = {
  // ---- HUD ----
  shield: (w = 20, h = 20) => s(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`, '0 0 24 24', w, h),

  heartFull: (w = 18, h = 18) => sf(`<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`, '0 0 24 24', w, h),

  heartEmpty: (w = 18, h = 18) => s(`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`, '0 0 24 24', w, h),

  star: (w = 18, h = 18) => sf(`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`, '0 0 24 24', w, h),

  crown: (w = 22, h = 22) => sf(`<path d="M2 20h20V9l-4 4-6-8-6 8-4-4v11z"/><rect x="2" y="20" width="20" height="2" rx="1"/>`, '0 0 24 24', w, h),

  volume: (w = 18, h = 18) => s(`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`, '0 0 24 24', w, h),

  volumeOff: (w = 18, h = 18) => s(`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`, '0 0 24 24', w, h),

  refresh: (w = 18, h = 18) => s(`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`, '0 0 24 24', w, h),

  home: (w = 18, h = 18) => s(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`, '0 0 24 24', w, h),

  // ---- Navigation / Quest ----
  compass: (w = 20, h = 20) => s(`<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`, '0 0 24 24', w, h),

  mapPin: (w = 20, h = 20) => s(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`, '0 0 24 24', w, h),

  arrowRight: (w = 16, h = 16) => s(`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`, '0 0 24 24', w, h),

  arrowUp: (w = 16, h = 16) => s(`<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`, '0 0 24 24', w, h),

  arrowDown: (w = 16, h = 16) => s(`<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`, '0 0 24 24', w, h),

  arrowLeft: (w = 16, h = 16) => s(`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`, '0 0 24 24', w, h),

  doorOpen: (w = 20, h = 20) => s(`<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561z"/>`, '0 0 24 24', w, h),

  key: (w = 18, h = 18) => s(`<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 0-7.778 7.778 5.5 5.5 0 0 0 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>`, '0 0 24 24', w, h),

  search: (w = 18, h = 18) => s(`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`, '0 0 24 24', w, h),

  target: (w = 18, h = 18) => s(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`, '0 0 24 24', w, h),

  // ---- Combat ----
  sword: (w = 20, h = 20) => s(`<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/>`, '0 0 24 24', w, h),

  crosshair: (w = 18, h = 18) => s(`<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>`, '0 0 24 24', w, h),

  zap: (w = 18, h = 18) => sf(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`, '0 0 24 24', w, h),

  // ---- Dialog / Quiz ----
  messageCircle: (w = 20, h = 20) => s(`<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>`, '0 0 24 24', w, h),

  bookOpen: (w = 20, h = 20) => s(`<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`, '0 0 24 24', w, h),

  checkCircle: (w = 18, h = 18) => s(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`, '0 0 24 24', w, h),

  xCircle: (w = 18, h = 18) => s(`<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`, '0 0 24 24', w, h),

  info: (w = 18, h = 18) => s(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`, '0 0 24 24', w, h),

  alertTriangle: (w = 18, h = 18) => s(`<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`, '0 0 24 24', w, h),

  lightbulb: (w = 18, h = 18) => s(`<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>`, '0 0 24 24', w, h),

  // ---- Characters ----
  user: (w = 20, h = 20) => s(`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`, '0 0 24 24', w, h),

  users: (w = 20, h = 20) => s(`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`, '0 0 24 24', w, h),

  // ---- Misc UI ----
  trophy: (w = 20, h = 20) => s(`<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>`, '0 0 24 24', w, h),

  sparkles: (w = 18, h = 18) => s(`<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>`, '0 0 24 24', w, h),

  lock: (w = 18, h = 18) => s(`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`, '0 0 24 24', w, h),

  unlock: (w = 18, h = 18) => s(`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`, '0 0 24 24', w, h),

  scroll: (w = 18, h = 18) => s(`<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>`, '0 0 24 24', w, h),

  map: (w = 18, h = 18) => s(`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>`, '0 0 24 24', w, h),

  package: (w = 18, h = 18) => s(`<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`, '0 0 24 24', w, h),

  droplet: (w = 14, h = 14) => s(`<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`, '0 0 24 24', w, h),
} as const;

/** Wrap an icon in a styled inline container */
export function icon(svgStr: string, color?: string): string {
  const style = color ? `style="color:${color}; display:inline-flex; vertical-align:middle;"` : `style="display:inline-flex; vertical-align:middle;"`;
  return `<span class="icon-inline" ${style}>${svgStr}</span>`;
}
