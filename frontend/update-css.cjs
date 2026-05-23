const fs = require('fs');
const tailwindCode = fs.readFileSync('tailwind.config.js', 'utf8');
const match = tailwindCode.match(/"colors":\s*({[\s\S]*?})/);
if(match) {
  const colorsStr = match[1];
  const colors = eval('(' + colorsStr + ')');
  let rootVars = ':root {\n';
  let darkVars = '.dark {\n';
  let twColors = '"colors": {\n';
  
  for(const [key, val] of Object.entries(colors)) {
    // Generate light version: if background, make it white. If surface, light gray. If text, black.
    let lightVal = val;
    if(key === 'background' || key === 'surface' || key === 'surface-dim') lightVal = '#f8f9fa';
    if(key.startsWith('surface-container')) lightVal = '#ffffff';
    if(key === 'on-surface' || key === 'on-background' || key === 'on-surface-variant') lightVal = '#1a1a1a';
    if(key === 'outline' || key === 'outline-variant') lightVal = '#dee2e6';
    
    rootVars += `  --color-${key}: ${lightVal};\n`;
    darkVars += `  --color-${key}: ${val};\n`;
    twColors += `    "${key}": "var(--color-${key})",\n`;
  }
  rootVars += '}\n';
  darkVars += '}\n';
  twColors += '  }';
  
  const newTailwind = tailwindCode.replace(/"colors":\s*{[\s\S]*?}/, twColors);
  fs.writeFileSync('tailwind.config.js', newTailwind);
  
  let css = fs.readFileSync('src/index.css', 'utf8');
  css = css.replace(/@layer base {\n  body {/, '@layer base {\n' + rootVars + darkVars + '  body {\n    overflow-x: hidden;\n');
  fs.writeFileSync('src/index.css', css);
  console.log('done');
}
