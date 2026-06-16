#!/usr/bin/env node
/**
 * 数据库验证脚本
 * 检查所有 JSON 数据文件是否符合 Schema 要求
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let errors = 0;
let warnings = 0;
let checked = 0;

function error(file, msg) {
  console.error(`  ✗ ERROR: ${msg}`);
  errors++;
}

function warn(file, msg) {
  console.warn(`  ⚠ WARN: ${msg}`);
  warnings++;
}

function validateHero(hero, file) {
  const required = ['id', 'name', 'title', 'faction', 'role', 'difficulty', 'description', 'lore'];
  required.forEach(field => {
    if (!hero[field]) error(file, `Missing required field: ${field}`);
  });
  if (hero.role && !Array.isArray(hero.role)) error(file, 'role must be an array');
  if (hero.difficulty && ![1, 2, 3].includes(hero.difficulty)) error(file, 'difficulty must be 1, 2, or 3');
  if (hero.id && hero.id !== path.basename(file, '.json')) warn(file, `id "${hero.id}" doesn't match filename`);
  if (hero.description && hero.description.length > 300) warn(file, 'description is too long (>300 chars)');
}

function validateFaction(faction, file) {
  const required = ['id', 'name', 'type', 'description', 'content'];
  required.forEach(field => {
    if (!faction[field]) error(file, `Missing required field: ${field}`);
  });
  const validStatuses = ['active', 'destroyed', 'merged', 'dormant', 'unknown'];
  if (faction.status && !validStatuses.includes(faction.status)) {
    error(file, `Invalid status: ${faction.status}`);
  }
}

function validateEvent(event, file) {
  const required = ['id', 'name', 'era', 'description', 'content', 'type'];
  required.forEach(field => {
    if (!event[field]) error(file, `Missing required field: ${field}`);
  });
  if (event.participants && !Array.isArray(event.participants)) error(file, 'participants must be an array');
}

function validateLocation(loc, file) {
  const required = ['id', 'name', 'type', 'description', 'content'];
  required.forEach(field => {
    if (!loc[field]) error(file, `Missing required field: ${field}`);
  });
}

const validators = {
  heroes: validateHero,
  factions: validateFaction,
  events: validateEvent,
  locations: validateLocation,
};

console.log('🔍 Validating data files...\n');

Object.entries(validators).forEach(([dirName, validator]) => {
  const dirPath = path.join(DATA_DIR, dirName);
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ${dirName}/: directory not found\n`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'index.json');
  console.log(`📁 ${dirName}/ (${files.length} files)`);

  files.forEach(f => {
    const filePath = path.join(dirPath, f);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      validator(data, f);
      checked++;
    } catch (err) {
      error(f, `JSON parse error: ${err.message}`);
    }
  });
  console.log();
});

console.log('─'.repeat(40));
console.log(`✅ Checked: ${checked} files`);
if (errors > 0) console.error(`❌ Errors: ${errors}`);
if (warnings > 0) console.warn(`⚠️  Warnings: ${warnings}`);
if (errors === 0 && warnings === 0) console.log('🎉 All validations passed!');

process.exit(errors > 0 ? 1 : 0);
