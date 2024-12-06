import test from 'node:test';
import assert from 'node:assert';
import { findImageFiles, findEmberFiles } from './fileUtils.js';
import path from 'path';

test('findImageFiles should return empty array for non-existent directory', async (t) => {
  const nonExistentPath = path.join(process.cwd(), 'non-existent');
  const files = await findImageFiles(nonExistentPath);
  assert.deepStrictEqual(files, []);
});

test('findEmberFiles should return empty array for non-existent directory', async (t) => {
  const nonExistentPath = path.join(process.cwd(), 'non-existent');
  const files = await findEmberFiles(nonExistentPath);
  assert.deepStrictEqual(files, []);
});