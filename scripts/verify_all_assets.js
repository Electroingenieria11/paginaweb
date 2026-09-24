const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const htmlFiles = [
  'index.html',
  'alumbrado-publico.html',
  'suministros.html',
  'obras.html',
  'nosotros.html',
  'contacto.html',
  'proyecto-detalle.html'
];

let errors = [];
let checkedAssetsCount = 0;

console.log('=== VERIFYING HTML FILES FOR BROKEN ASSETS ===');
htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`HTML file missing: ${file}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // Match src="..." or href="..." for local assets
  const srcRegex = /(?:src|href)=["']([^"']+\.(?:png|jpg|jpeg|webp|svg|gif|ico))["']/gi;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    const assetRel = match[1];
    if (assetRel.startsWith('http') || assetRel.startsWith('//') || assetRel.startsWith('data:')) continue;
    checkedAssetsCount++;
    const assetPath = path.resolve(rootDir, assetRel);
    if (!fs.existsSync(assetPath)) {
      errors.push(`[${file}] Broken asset in src/href: ${assetRel}`);
    }
  }

  // Match url('...')
  const urlRegex = /url\(["']?([^"')]+\.(?:png|jpg|jpeg|webp|svg|gif|ico))["']?\)/gi;
  while ((match = urlRegex.exec(content)) !== null) {
    const assetRel = match[1];
    if (assetRel.startsWith('http') || assetRel.startsWith('//') || assetRel.startsWith('data:')) continue;
    checkedAssetsCount++;
    const assetPath = path.resolve(rootDir, assetRel);
    if (!fs.existsSync(assetPath)) {
      errors.push(`[${file}] Broken asset in url(): ${assetRel}`);
    }
  }
});

console.log('=== VERIFYING CSS FILES FOR BROKEN ASSETS ===');
const cssFiles = ['css/main.css', 'css/components.css', 'css/audit-fix.css'];
cssFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const urlRegex = /url\(["']?([^"')]+\.(?:png|jpg|jpeg|webp|svg|gif|ico))["']?\)/gi;
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const assetRel = match[1];
    if (assetRel.startsWith('http') || assetRel.startsWith('//') || assetRel.startsWith('data:')) continue;
    checkedAssetsCount++;
    // CSS files are in css/, so relative paths resolve against css/
    const assetPath = path.resolve(path.dirname(filePath), assetRel);
    if (!fs.existsSync(assetPath)) {
      errors.push(`[${file}] Broken asset in CSS url(): ${assetRel} -> resolved to ${assetPath}`);
    }
  }
});

console.log('=== VERIFYING JS FILES FOR BROKEN ASSETS ===');
const jsFiles = ['js/main.js'];
jsFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const assetRegex = /['"](assets\/[^'"]+\.(?:png|jpg|jpeg|webp|svg|gif|ico))['"]/gi;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    const assetRel = match[1];
    checkedAssetsCount++;
    const assetPath = path.resolve(rootDir, assetRel);
    if (!fs.existsSync(assetPath)) {
      errors.push(`[${file}] Broken asset referenced in JS: ${assetRel}`);
    }
  }
});

console.log(`\nChecked ${checkedAssetsCount} asset references.`);
if (errors.length > 0) {
  console.error(`Found ${errors.length} BROKEN ASSET REFERENCES:`);
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('PERFECT! 0 broken asset references detected across all HTML, CSS, and JS files.');
}
