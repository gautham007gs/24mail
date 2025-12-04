#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve(process.cwd(), 'dist', 'public', 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at', indexPath);
  process.exit(0);
}
let content = fs.readFileSync(indexPath, 'utf8');
const before = content;
// Remove any modulepreload link with a data: URI
content = content.replace(/<link[^>]+rel=["']modulepreload["'][^>]*href=["']data:[^"']+["'][^>]*>\s*/g, '');

if (content !== before) {
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('Removed inlined data: modulepreload links from index.html');
} else {
  console.log('No inlined data: modulepreload links found.');
}
