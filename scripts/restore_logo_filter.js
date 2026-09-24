/**
 * restore_logo_filter.js
 * Removes ALL filter overrides applied to .footer-logo-ei in audit-fix.css
 * and replaces them with filter: none so the PNG renders as-is.
 */
const fs = require('fs');

let css = fs.readFileSync('css/audit-fix.css', 'utf8');

// Remove every rule block that touches .footer-logo-ei filter
// There are potentially multiple blocks — we sanitize all of them

// Replace the blue filter block
const blueFilterRe = /\/\* Convierte negro -> #003690 azul corporativo \*\/\s*\n\s*filter:[^;]+;/g;
css = css.replace(blueFilterRe, 'filter: none !important;  /* PNG ya tiene fondo azul corporativo */');

// Replace any remaining brightness/invert filter on footer-logo-ei
const destructiveRe = /(\.footer-logo-ei\s*\{[^}]*?)filter\s*:[^;!]+(!important)?;/gs;
css = css.replace(destructiveRe, '$1filter: none !important;');

// Remove hover filter override (no longer needed)
const hoverRe = /\.footer-col\.col-brand a:hover \.footer-logo-ei\s*\{[^}]*filter:[^}]*\}/gs;
css = css.replace(hoverRe, '/* footer-logo-ei hover: sin filtro - logo usa su propio color */');

fs.writeFileSync('css/audit-fix.css', css, 'utf8');
console.log('[OK] All destructive filters removed from .footer-logo-ei');

// Verify
const checkIdx = css.indexOf('.footer-logo-ei');
if (checkIdx > -1) {
  console.log('Current .footer-logo-ei rules:');
  console.log(css.substring(checkIdx, checkIdx + 300));
}
