#!/usr/bin/env node
// setup-env.js: Cross-platform replacement for setup-env.sh
import { copyFileSync, existsSync } from 'fs';

function copyIfNotExists(src, dest) {
  if (!existsSync(dest)) {
    copyFileSync(src, dest);
    return true;
  }
  return false;
}

const files = [
  ['packages/todo0/.env.default', 'packages/todo0/.env'],
  ['packages/wiki0/.env.default', 'packages/wiki0/.env'],
  ['packages/authorization-server/.env.wiki.default', 'packages/authorization-server/.env.wiki'],
  ['packages/authorization-server/.env.todo.default', 'packages/authorization-server/.env.todo'],
  ['packages/idp/.env.default', 'packages/idp/.env'],
];

// Copy default env files if they do not exist
files.forEach(([src, dest]) => {
  if (existsSync(src)) {
    copyIfNotExists(src, dest);
  }
});

console.log('\n[setup:env] Default .env files copied (if not already present).');
