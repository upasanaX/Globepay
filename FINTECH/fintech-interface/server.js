const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const BUILD_DIR = path.join(__dirname, 'build');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(BUILD_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  const ext = path.extname(filePath);
  
  // If no extension (SPA route like /dashboard), serve index.html
  if (!ext) {
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA routing
      fs.readFile(path.join(BUILD_DIR, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
      return;
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('===========================================');
  console.log('  GlobePay is running!');
  console.log('');
  console.log('  Open in your browser:');
  console.log('  http://localhost:' + PORT);
  console.log('===========================================');
  console.log('');
});
