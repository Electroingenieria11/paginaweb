/**
 * move_social_to_brand.js
 * Moves the .footer-social-icons block from .col-contact to .col-brand
 * (after the .footer-slogan) in all 7 production HTML files.
 */
const fs = require('fs');

const files = [
  'index.html',
  'alumbrado-publico.html',
  'suministros.html',
  'obras.html',
  'nosotros.html',
  'contacto.html',
  'proyecto-detalle.html',
];

// The exact social icons block to extract and relocate
const SOCIAL_BLOCK = `      <div class="footer-social-icons">
        <a href="https://co.linkedin.com/company/electroingenier%C3%ADa-s-a-s-" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="https://www.instagram.com/electroingenieria/reels/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.facebook.com/electroingenieriaa/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="https://wa.me/573117194015?text=Hola%20Electroingenier%C3%ADa,%20deseo%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
      </div>`;

// Regex to remove the social block from col-contact (handles whitespace variations)
const SOCIAL_REMOVE_RE = /\s*<div class="footer-social-icons">[\s\S]*?<\/div>\s*(?=\n\s*<\/div>\s*\n\s*<\/div>)/;

// Where to insert: after the footer-slogan closing tag inside col-brand
const SLOGAN_CLOSE = `<p class="footer-slogan">Trabajando con buena energia</p>`;
const SLOGAN_WITH_SOCIAL = `<p class="footer-slogan">Trabajando con buena energia</p>
      <div class="footer-social-icons">
        <a href="https://co.linkedin.com/company/electroingenier%C3%ADa-s-a-s-" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="https://www.instagram.com/electroingenieria/reels/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.facebook.com/electroingenieriaa/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="https://wa.me/573117194015?text=Hola%20Electroingenier%C3%ADa,%20deseo%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
      </div>`;

let totalChanges = 0;

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    const original = content;

    // Step 1: Add social icons after footer-slogan in col-brand (only if not already there)
    if (!content.includes('footer-social-icons') || 
        content.indexOf('footer-social-icons') > content.indexOf('col-contact')) {
      // Social icons are in col-contact, need to add to col-brand
      if (content.includes(SLOGAN_CLOSE) && !content.includes('col-brand">') || true) {
        content = content.replace(SLOGAN_CLOSE, SLOGAN_WITH_SOCIAL);
      }
    }

    // Step 2: Remove social icons from col-contact
    // Find col-contact section and remove the social icons div from it
    const colContactStart = content.indexOf('<div class="footer-col col-contact">');
    if (colContactStart !== -1) {
      const colContactEnd = content.indexOf('</div>', 
        content.indexOf('</div>', colContactStart + 100) + 1
      ) + 6;
      let colContact = content.substring(colContactStart, colContactEnd);
      
      // Remove the social icons block from col-contact
      const socialStart = colContact.indexOf('\n      <div class="footer-social-icons">');
      const socialEnd = colContact.indexOf('</div>', colContact.lastIndexOf('<a href="https://wa.me')) + 6;
      
      if (socialStart !== -1 && socialEnd > socialStart) {
        colContact = colContact.substring(0, socialStart) + colContact.substring(socialEnd);
        content = content.substring(0, colContactStart) + colContact + content.substring(colContactEnd);
      }
    }

    if (content !== original) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('[OK] Updated:', f);
      totalChanges++;
    } else {
      console.log('[--] No changes:', f);
    }
  } catch (e) {
    console.log('[ERR]', f, e.message);
  }
});

console.log('\nDone. Files updated:', totalChanges);
