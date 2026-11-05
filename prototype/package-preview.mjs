import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.dirname(fileURLToPath(import.meta.url));
const [html,css,app,icon]=await Promise.all(['index.html','style.css','app.mjs','icon.svg'].map(name=>readFile(path.join(root,name),'utf8')));
const iconUri='data:image/svg+xml;base64,'+Buffer.from(icon).toString('base64');
// Preserve module scope and legacy/current version routing. Every dependency is
// embedded recursively, so the standalone file makes no external script fetch.
const embedded = new Map();
async function embedModule(filename) {
  if (embedded.has(filename)) return embedded.get(filename);
  let source = await readFile(filename,'utf8');
  const imports = [...source.matchAll(/(?:import|export)\s+[^;]*?\s+from\s+(['"])(\.\/[^'"]+)\1\s*;?/g)];
  for (const match of imports) {
    const uri = await embedModule(path.resolve(path.dirname(filename),match[2]));
    source = source.replace(match[0],match[0].replace(match[1]+match[2]+match[1],JSON.stringify(uri)));
  }
  const uri='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
  embedded.set(filename,uri);
  return uri;
}
const engineUri=await embedModule(path.join(root,'engine.mjs'));
const script=app.replace(/from\s+['"]\.\/engine\.mjs['"]/, 'from '+JSON.stringify(engineUri));
if(/<\/script/i.test(script))throw Error('Unexpected closing script tag');
const standalone=html.replace('href="icon.svg"',`href="${iconUri}"`).replace('src="icon.svg"',`src="${iconUri}"`).replace('<link rel="stylesheet" href="style.css">',`<style>\n${css}</style>`).replace('<script type="module" src="app.mjs"></script>',`<script type="module">\n${script}</script>`);
await writeFile(path.join(root,'standalone.html'),standalone);
console.log('Standalone preview saved. No external runtime dependencies.');
