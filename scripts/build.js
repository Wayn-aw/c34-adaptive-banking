// Builds dist/adaptive-banking-prototype.html: the whole app in one file that works offline
// by double-clicking. Edit the files in src/, then run:  npm run build
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'src'), DIST = path.join(__dirname, '..', 'dist');
const SCRIPTS = ['js/app.js', 'js/ml.js', 'js/features.js', 'js/appmode.js', 'js/spotlight.js'];

const index = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
let head = index.split('<body>')[0];
// The single file has no manifest, icons or external links: drop them
head = head.replace(/<link rel="(manifest|icon|apple-touch-icon)"[^>]*>\n?/g, '');
head = head.replace(/<link rel="stylesheet" href="css\/styles.css">\n?/, '');
const css = fs.readFileSync(path.join(SRC, 'css/styles.css'), 'utf8');
head = head.replace('</head>', '<style>\n' + css + '\n</style>\n</head>');

let body = '<body>\n<div id="app"></div>\n<noscript>This prototype needs JavaScript.</noscript>\n';
for (const s of SCRIPTS) {
  const code = fs.readFileSync(path.join(SRC, s), 'utf8').replace(/<\/script/g, '<\\/script');
  body += '<script>\n' + code + '\n</script>\n';
}
body += '</body>\n</html>\n';

const out = head + body;
if (out.includes('googleapis')) throw new Error('external font link found');
fs.mkdirSync(DIST, { recursive: true });
const file = path.join(DIST, 'adaptive-banking-prototype.html');
fs.writeFileSync(file, out, 'utf8');
console.log('Wrote dist/adaptive-banking-prototype.html, ' + Buffer.byteLength(out) + ' bytes');
