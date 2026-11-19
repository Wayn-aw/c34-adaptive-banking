// Zero-dependency web server for the prototype. Run: npm start  (or: node server.js)
// Prints an address you can open on a phone or tablet on the same Wi-Fi.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = Number(process.env.PORT) || 3000, ROOT = path.join(__dirname, 'src');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || /(^|[\\/])\./.test(path.relative(ROOT, file))) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('\n  Adaptive Banking is running\n');
  console.log('  This computer:   http://localhost:' + PORT);
  Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal)
    .forEach(n => console.log('  Phone or tablet: http://' + n.address + ':' + PORT + '   (same Wi-Fi)'));
  console.log('\n  Demo tools: the button at the top left, or Shift + D. Stop with Ctrl + C.\n');
});
