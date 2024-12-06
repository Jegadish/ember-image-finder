import path from 'path';
import { createImageMatcher, normalizeImagePath } from './pathMatchers.js';
import { extractImageReferences } from './referenceExtractor.js';

export async function validateImageReferences(emberFiles, imageFiles) {
  const results = {
    referencedImages: new Map(),
    unreferencedImages: new Map(imageFiles),
    missingImages: new Set(),
    duplicateNames: new Map(),
    statistics: {
      totalImages: imageFiles.size,
      totalEmberFiles: emberFiles.size,
      totalReferences: 0,
      imagesByType: new Map()
    }
  };

  // Initialize image type statistics
  for (const imageInfo of imageFiles.values()) {
    const ext = imageInfo.extension.slice(1);
    results.statistics.imagesByType.set(ext, (results.statistics.imagesByType.get(ext) || 0) + 1);
  }

  const imageMatcher = createImageMatcher(imageFiles);

  for (const [filePath, emberFile] of emberFiles) {
    const references = extractImageReferences(emberFile.content);
    
    for (const ref of references) {
      const normalizedPath = normalizeImagePath(ref.fullPath);
      const matchByPath = imageMatcher.findByPath(normalizedPath);
      const matchesByName = imageMatcher.findByName(ref.fileName);
      
      if (matchByPath) {
        // Found exact path match
        const { originalPath, info } = matchByPath;
        addReference(results, originalPath, info, emberFile.relativePath, ref.position);
      } else if (matchesByName && matchesByName.length > 0) {
        // Found filename match(es)
        if (matchesByName.length === 1) {
          // Single match by name
          const { originalPath, info } = matchesByName[0];
          addReference(results, originalPath, info, emberFile.relativePath, ref.position);
        } else {
          // Multiple matches - potential ambiguity
          results.duplicateNames.set(ref.fileName, {
            referencedIn: emberFile.relativePath,
            position: ref.position,
            matches: matchesByName.map(m => m.originalPath)
          });
        }
      } else {
        // No matches found
        results.missingImages.add(ref.fullPath);
      }
    }
  }

  return results;
}

function addReference(results, imagePath, imageInfo, emberFile, position) {
  if (!results.referencedImages.has(imagePath)) {
    results.referencedImages.set(imagePath, {
      ...imageInfo,
      referencedIn: new Map(),
      positions: {}
    });
  }
  
  const imageRef = results.referencedImages.get(imagePath);
  if (!imageRef.referencedIn.has(emberFile)) {
    imageRef.referencedIn.set(emberFile, new Set());
    imageRef.positions[emberFile] = [];
  }
  
  imageRef.referencedIn.get(emberFile).add(position.line);
  imageRef.positions[emberFile].push(position);
  
  results.unreferencedImages.delete(imagePath);
  results.statistics.totalReferences++;
}