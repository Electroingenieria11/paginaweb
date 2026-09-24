/**
 * fix_logo_filter.js
 * Removes the old .footer-logo-ei brightness filter blocks and
 * ensures only the correct #003690 blue filter remains.
 */
const fs = require('fs');

let css = fs.readFileSync('css/audit-fix.css', 'utf8');

// Remove old block 1: first .footer-logo-ei with brightness(1.05)
css = css.replace(
  /\/\* old footer-logo-ei removed \*\//g, ''
);
css = css.replace(
  /\/\* old hover removed \*\//g, ''
);

// Also clean up any remaining brightness(1.05) footer-logo-ei rule
// by targeting the pattern precisely
const oldBlock1Re = /\.footer-logo-ei \{[^}]*filter: brightness\(1\.05\)[^}]*\}/s;
const oldBlock2Re = /\.footer-col\.col-brand a:hover \.footer-logo-ei \{\s*filter: brightness\(1\.2\)[^}]*\}/s;

let changed = 0;
if (oldBlock1Re.test(css)) {
  css = css.replace(oldBlock1Re, '');
  changed++;
  console.log('[OK] Removed old brightness(1.05) block');
}
if (oldBlock2Re.test(css)) {
  css = css.replace(oldBlock2Re, '');
  changed++;
  console.log('[OK] Removed old brightness(1.2) hover block');
}

fs.writeFileSync('css/audit-fix.css', css, 'utf8');
console.log('Blocks cleaned:', changed);

// Verify the correct blue filter is still there
const blueIdx = css.indexOf('hue-rotate(179deg)');
console.log('Blue filter present:', blueIdx > -1);
if (blueIdx > -1) {
  console.log(css.substring(blueIdx - 100, blueIdx + 120));
}
