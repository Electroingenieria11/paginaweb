/**
 * update_footer_brand.js
 * Replaces the old footer logo + long paragraph with the EI isotipo + slogan
 * in all production HTML pages.
 */
const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'alumbrado-publico.html',
  'suministros.html',
  'obras.html',
  'nosotros.html',
  'contacto.html',
  'proyecto-detalle.html',
];

// Old block: <img class="footer-logo"> + the long <p> description inside .col-brand
// Captured as a multiline regex. We anchor on the known image filename.
const OLD_IMG   = /(<div class="footer-col col-brand">[\s\S]*?)<img[^>]*Logos Electroingenieria[^>]*>/;
const OLD_PARA  = /<p>Más de 31 años transformando[\s\S]*?<\/p>/;

const NEW_IMG = `$1<a href="index.html" aria-label="Inicio Electroingenieria">
        <img src="assets/logos/Simbolo ei marca registrada-01.png" alt="Isotipo EI - Electroingenieria S.A.S." class="footer-logo-ei">
      </a>`;

const NEW_PARA = `<p class="footer-slogan">Trabajando con buena energia</p>`;

let totalChanges = 0;

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    const original = content;

    // Step 1: replace old logo img
    if (OLD_IMG.test(content)) {
      content = content.replace(OLD_IMG, NEW_IMG);
    } else {
      console.log('  [WARN] img not found:', f);
    }

    // Step 2: replace long paragraph
    if (OLD_PARA.test(content)) {
      content = content.replace(OLD_PARA, NEW_PARA);
    } else {
      console.log('  [WARN] paragraph not found:', f);
    }

    if (content !== original) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('[OK] Updated:', f);
      totalChanges++;
    } else {
      console.log('[--] No changes needed:', f);
    }
  } catch (e) {
    console.log('[ERR]', f, e.message);
  }
});

console.log('\nDone. Total files updated:', totalChanges);
