#!/usr/bin/env node
/**
 * 数据索引生成器
 * 扫描 data/ 目录，为每个分类生成 index.json
 * 用途：批量添加英雄后运行此脚本重建索引
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const DIRS_TO_INDEX = [
  'heroes', 'factions', 'events', 'locations', 'organizations'
];

function generateIndex(dirName) {
  const dirPath = path.join(DATA_DIR, dirName);
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ${dirName}: directory not found, skipping`);
    return;
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json') && f !== 'index.json');

  const items = files.map(f => {
    try {
      const content = fs.readFileSync(path.join(dirPath, f), 'utf-8');
      const data = JSON.parse(content);
      // Return lightweight summary (strip long text fields)
      const { lore: _l, content: _c, ...summary } = data;
      return summary;
    } catch (err) {
      console.error(`  ✗ Failed to parse ${f}:`, err.message);
      return null;
    }
  }).filter(Boolean);

  const indexPath = path.join(dirPath, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`✅ ${dirName}: generated index with ${items.length} items`);
}

console.log('🔄 Generating data indexes...\n');
DIRS_TO_INDEX.forEach(generateIndex);
console.log('\n✨ Done!');
