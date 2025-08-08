// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const app = express();
// const port = process.env.PORT || 5173;
//
// // Servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'dist')));
//
// // Manejar SPA routing - todas las rutas devuelven index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
//
// app.listen(port, '0.0.0.0', () => {
//   console.log(`🚗 TuCarro frontend serving on port ${port}`);
// });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Verificar que existe el directorio dist y index.html
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('DEBUG...');
console.log('🔍 Checking build files...');
console.log('📁 Dist directory:', distPath);
console.log('📄 Index file:', indexPath);

if (!fs.existsSync(distPath)) {
  console.error('❌ ERROR: dist directory not found!');
  console.error('📋 Available directories:', fs.readdirSync(__dirname));
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('❌ ERROR: index.html not found in dist!');
  console.error('📋 Files in dist:', fs.readdirSync(distPath));
  process.exit(1);
}

console.log('✅ Build files found successfully');

// Servir archivos estáticos
app.use(express.static(distPath));

// Manejar SPA routing - todas las rutas devuelven index.html
app.get('*', (req, res) => {
  console.log(`📝 Request: ${req.method} ${req.url}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving index.html:', err);
      res.status(500).send('Server Error');
    }
  });
});

// Manejar errores del servidor
app.on('error', (error) => {
  console.error('💥 Server error:', error);
});

// Iniciar servidor con manejo de errores
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚗 TuCarro frontend serving on port ${port}`);
  console.log(`🌐 Server ready and waiting for requests...`);
});

// Manejar señales de cierre
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});