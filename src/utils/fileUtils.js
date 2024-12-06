import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';
import { normalizePath, validatePath } from './pathUtils.js';

export async function findImageFiles(imagePath) {
  try {
    const normalizedPath = await validatePath(imagePath);
    
    const imageFiles = await glob('**/*.{png,jpg,jpeg,gif,svg,webp}', {
      cwd: normalizedPath,
      absolute: true,
      followSymbolicLinks: true,
      ignore: ['node_modules/**', 'tmp/**', 'dist/**']
    });

    const imageMap = new Map();
    for (const absolutePath of imageFiles) {
      const relativePath = path.relative(normalizedPath, absolutePath);
      const stats = await fs.stat(absolutePath);
      
      imageMap.set(relativePath, {
        relativePath,
        absolutePath,
        size: stats.size,
        extension: path.extname(absolutePath).toLowerCase(),
        created: stats.birthtime,
        modified: stats.mtime
      });
    }

    return imageMap;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Images directory does not exist: ${imagePath}`);
    }
    throw error;
  }
}

export async function findEmberFiles(appPath) {
  try {
    const normalizedPath = await validatePath(appPath);

    // Include all relevant Ember.js files, including tests
    const emberFiles = await glob('**/*.{js,hbs,css,scss}', {
      cwd: normalizedPath,
      absolute: true,
      followSymbolicLinks: true,
      ignore: ['node_modules/**', 'tmp/**', 'dist/**']
    });

    const fileMap = new Map();
    for (const absolutePath of emberFiles) {
      const relativePath = path.relative(normalizedPath, absolutePath);
      const stats = await fs.stat(absolutePath);
      const content = await fs.readFile(absolutePath, 'utf-8');
      const fileType = getFileType(absolutePath);
      
      fileMap.set(relativePath, {
        relativePath,
        absolutePath,
        type: fileType,
        content,
        modified: stats.mtime,
        isTest: isTestFile(relativePath)
      });
    }

    return fileMap;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Ember application directory does not exist: ${appPath}`);
    }
    throw error;
  }
}

function getFileType(filePath) {
  const ext = path.extname(filePath).slice(1);
  // Map SCSS to CSS for pattern matching
  return ext === 'scss' ? 'css' : ext;
}

function isTestFile(relativePath) {
  return (
    relativePath.includes('/tests/') ||
    relativePath.endsWith('.test.js') ||
    relativePath.endsWith('-test.js') ||
    relativePath.endsWith('.spec.js')
  );
}