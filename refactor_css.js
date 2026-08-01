const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'assets', 'css');
const files = ['css3.css', 'html5.css', 'index.css', 'js.css', 'php.css', 'sql.css'];

// 1. We will extract common CSS from css3.css
const css3Content = fs.readFileSync(path.join(cssDir, 'css3.css'), 'utf-8');

// The common CSS starts around line 24 (body) and includes .navbar-custom, .notion-card, .pedago-box, etc.
// But it's easier to find the exact parts.
// Actually, let's extract by regex or split.

// Let's just create global.css manually via fs.writeFileSync and use the content from css3.css
// But wait, the common parts are between "body {" and "/* Classes de Coloration Syntaxique"
// And also the parts AFTER the syntax coloring!
// Let's grab the whole css3.css, and REMOVE the specific parts.

let globalCss = css3Content;

// Remove :root and [data-bs-theme="dark"] at the top which are specific to the file's primary color
// Actually, the top variables for --edu-bg, --edu-card-bg, --type-remember are identical! 
// ONLY --edu-primary is different.
// So global.css CAN have the :root with all other variables, except --edu-primary which will be defined in the individual files!
// No, it's easier to just leave the :root block in the individual files, and remove it from global.css.

let lines = globalCss.split('\n');

// Find the index of "body {"
let bodyIndex = lines.findIndex(l => l.startsWith('body {'));
// Find the index of "/* Classes de Coloration Syntaxique"
let syntaxStartIndex = lines.findIndex(l => l.includes('Classes de Coloration Syntaxique'));
// Find the index of "/* Style de sélection de la liste du sommaire pédagogique */"
let tocActiveIndex = lines.findIndex(l => l.includes('Style de sélection de la liste du sommaire pédagogique'));
// Find the index of "/* =============================================" before "Styles Fiche de Révision & Modal Dialogue"
let modalIndex = lines.findIndex(l => l.includes('Styles Fiche de Révision & Modal Dialogue'));

// In index.css, the syntax and toc active parts don't exist.
// Let's construct global.css parts:
let globalPart1 = lines.slice(bodyIndex, syntaxStartIndex).join('\n');
// The syntax coloring is specific.
// The toc active style is also specific (different colors per file).
// The modal and everything after is common.
let globalPart2 = lines.slice(modalIndex - 2).join('\n'); // -2 to include the comment box

// Let's check if the specific color is used in globalPart1 or globalPart2.
// In globalPart1:
// .notion-card:hover { border-color: var(--edu-primary); } -> OK!
// .category-header { border-left: 5px solid var(--edu-primary); } -> OK!
// .floating-toc-btn { box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4) !important; } -> Wait, this has a hardcoded RGB (37, 99, 235 is #2563eb which is CSS3's primary color!)
// .offcanvas-toc .offcanvas-header { background-color: rgba(37, 99, 235, 0.05); } -> Hardcoded RGB!
// .revision-table tbody tr:hover { background-color: rgba(37, 99, 235, 0.04) !important; } -> Hardcoded RGB!
// .modal-header-custom { background-color: rgba(37, 99, 235, 0.05); } -> Hardcoded RGB!

// Let's convert all these hardcoded `rgba(..., opacity)` to `color-mix` or use native variables!
// With CSS variables, we can't easily add opacity to a hex color unless it's defined as an RGB comma-separated list.
// Or we can use color-mix(in srgb, var(--edu-primary) 10%, transparent) !
// Let's replace the hardcoded RGBs with color-mix in global.css.

// The hardcoded rgb for CSS3 is 37, 99, 235.
globalPart2 = globalPart2.replace(/rgba\(37,\s*99,\s*235,\s*([0-9.]+)\)/g, 'color-mix(in srgb, var(--edu-primary) calc($1 * 100%), transparent)');

let finalGlobalCss = `/* =============================================
   Styles Globaux Communs (global.css)
   ============================================= */

` + globalPart1 + '\n\n' + globalPart2;

fs.writeFileSync(path.join(cssDir, 'global.css'), finalGlobalCss);
console.log('Created global.css');

// Now we update each individual file
for (let file of files) {
  let content = fs.readFileSync(path.join(cssDir, file), 'utf-8');
  let lines = content.split('\n');
  
  let newContent = '';
  
  // We want to keep the :root and [data-bs-theme="dark"] blocks.
  // And the syntax highlighting blocks.
  // And the toc-item-active blocks.
  
  let bodyIdx = lines.findIndex(l => l.startsWith('body {'));
  let rootBlocks = lines.slice(0, bodyIdx).join('\n');
  
  // For index.css, there is no syntax coloring.
  if (file === 'index.css') {
     newContent = `@import url('global.css');\n\n` + rootBlocks;
     
     // index.css also has .hero-banner and .module-card at the top which are NOT in css3.css!
     // Let's extract them from index.css.
     let printIdx = lines.findIndex(l => l.includes('@media print'));
     let specificIndexCss = lines.slice(bodyIdx, printIdx).join('\n');
     // specificIndexCss contains body, .navbar-custom, which are already in global.css.
     // Let's filter out what's in global.css
     // Actually, we can just grab .hero-banner, .module-card, .icon-box
     let heroMatch = content.match(/\.hero-banner\s*\{[\s\S]*?\}/);
     let moduleMatch = content.match(/\.module-card\s*\{[\s\S]*?\}/);
     let moduleHoverMatch = content.match(/\.module-card:hover\s*\{[\s\S]*?\}/);
     let iconBoxMatch = content.match(/\.icon-box\s*\{[\s\S]*?\}/);
     
     newContent += (heroMatch ? heroMatch[0] + '\n\n' : '') + 
                   (moduleMatch ? moduleMatch[0] + '\n\n' : '') + 
                   (moduleHoverMatch ? moduleHoverMatch[0] + '\n\n' : '') + 
                   (iconBoxMatch ? iconBoxMatch[0] + '\n\n' : '');
  } else {
     let synIdx = lines.findIndex(l => l.includes('Classes de Coloration Syntaxique'));
     let modalIdx = lines.findIndex(l => l.includes('Styles Fiche de Révision & Modal Dialogue'));
     
     let specificStyles = lines.slice(synIdx, modalIdx - 2).join('\n');
     
     newContent = `@import url('global.css');\n\n` + rootBlocks + '\n' + specificStyles;
  }
  
  fs.writeFileSync(path.join(cssDir, file), newContent);
  console.log(`Updated ${file}`);
}
