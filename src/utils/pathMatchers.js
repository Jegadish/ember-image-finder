import path from 'path';

export function createImageMatcher(imageFiles) {
  const fileNameMap = new Map();
  const fullPathMap = new Map();
  
  for (const [imagePath, info] of imageFiles) {
    const fileName = path.basename(imagePath);
    const normalizedPath = normalizeImagePath(imagePath);
    
    // Store by full path
    fullPathMap.set(normalizedPath.toLowerCase(), {
      originalPath: imagePath,
      info
    });
    
    // Store by filename
    if (!fileNameMap.has(fileName.toLowerCase())) {
      fileNameMap.set(fileName.toLowerCase(), []);
    }
    fileNameMap.get(fileName.toLowerCase()).push({
      originalPath: imagePath,
      info
    });
  }
  
  return {
    findByPath(searchPath) {
      const normalizedSearch = normalizeImagePath(searchPath).toLowerCase();
      return fullPathMap.get(normalizedSearch);
    },
    
    findByName(fileName) {
      const normalizedName = fileName.toLowerCase();
      return fileNameMap.get(normalizedName);
    }
  };
}

export function normalizeImagePath(imagePath) {
  return imagePath
    .replace(/^\.\.\/images\//, '')  // Remove relative path prefix
    .replace(/^\/images\//, '')      // Remove absolute path prefix
    .replace(/^images\//, '')        // Remove simple path prefix
    .replace(/\\/g, '/');            // Normalize slashes
}