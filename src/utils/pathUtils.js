import path from 'path';
import fs from 'fs/promises';

export async function validatePath(inputPath) {
  try {
    const normalizedPath = path.normalize(inputPath);
    await fs.access(normalizedPath);
    return normalizedPath;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Path does not exist: ${inputPath}`);
    }
    throw error;
  }
}

export function normalizePath(inputPath) {
  // Convert to absolute path if relative
  const absolutePath = path.isAbsolute(inputPath) 
    ? inputPath 
    : path.resolve(process.cwd(), inputPath);
    
  // Normalize the path (resolve .. and . segments)
  return path.normalize(absolutePath);
}