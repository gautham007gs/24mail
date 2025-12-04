#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { brotliCompressSync, gzipSync } from 'zlib';

const publicDir = path.resolve(process.cwd(), 'dist', 'public');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (full.endsWith('.br') || full.endsWith('.gz') || full.endsWith('.map')) continue;

    // Only compress common web assets
    if (!full.match(/\.(js|css|json|wasm|svg|png|jpg|jpeg|gif|webp|avif|woff2?)$/i)) continue;

    try {
      const buf = fs.readFileSync(full);

      // Brotli
      try {
        const brotli = brotliCompressSync(buf, { params: { [2]: 11 } });
        fs.writeFileSync(full + '.br', brotli);
      } catch (e) {
        // ignore
      }

      // Gzip
      try {
        const gzip = gzipSync(buf, { level: 9 });
        fs.writeFileSync(full + '.gz', gzip);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('precompress failed for', full, err?.message || err);
    }
  }
}

if (!fs.existsSync(publicDir)) {
  console.error('No public directory found at', publicDir);
  process.exit(1);
}

console.log('Precompressing assets under', publicDir);
walk(publicDir);
console.log('Precompression complete');
