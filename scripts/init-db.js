#!/usr/bin/env node
/**
 * 数据库初始化脚本
 * 创建所有必要的目录结构
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = [
  'data/heroes',
  'data/factions',
  'data/events',
  'data/timeline',
  'data/relations',
  'data/locations',
  'data/organizations',
  'data/quotes',
  'data/video-topics',
  'public/images/heroes',
  'public/images/factions',
  'public/images/events',
];

console.log('🚀 Initializing KOG Lore DB...\n');

DIRS.forEach(dir => {
  const fullPath = path.join(ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}/`);
  } else {
    console.log(`✓  Exists:  ${dir}/`);
  }
});

// Check for empty index files
const indexFiles = [
  { path: 'data/timeline/index.json', default: '[]' },
  { path: 'data/relations/index.json', default: '[]' },
  { path: 'data/organizations/index.json', default: '[]' },
  { path: 'data/quotes/index.json', default: '[]' },
  { path: 'data/video-topics/index.json', default: '[]' },
];

indexFiles.forEach(({ path: p, default: def }) => {
  const fullPath = path.join(ROOT, p);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, def, 'utf-8');
    console.log(`✅ Created: ${p}`);
  }
});

console.log('\n✨ Initialization complete!');
console.log('\nNext steps:');
console.log('  npm install');
console.log('  npm run dev');
