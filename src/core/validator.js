import { findImageFiles, findEmberFiles } from '../utils/fileUtils.js';
import { createImageMatcher } from '../utils/pathMatchers.js';
import { extractImageReferences } from '../utils/referenceExtractor.js';
import { initializeStatistics, updateReferenceStatistics } from './statistics.js';
import { processReference } from './referenceProcessor.js';

export async function validateImages(imagePath, emberAppPath) {
  const imageFiles = await findImageFiles(imagePath);
  const emberFiles = await findEmberFiles(emberAppPath);
  
  const results = {
    referencedImages: new Map(),
    unreferencedImages: new Map(imageFiles),
    missingImages: new Set(),
    duplicateNames: new Map(),
    statistics: initializeStatistics(imageFiles),
    summary: {
      referencedCount: 0,
      unreferencedCount: imageFiles.size,
      missingCount: 0,
      duplicateCount: 0,
      issues: {
        hasUnreferencedImages: imageFiles.size > 0,
        hasMissingImages: false,
        hasAmbiguousReferences: false
      }
    }
  };

  results.statistics.totalEmberFiles = emberFiles.size;
  const imageMatcher = createImageMatcher(imageFiles);

  for (const [filePath, emberFile] of emberFiles) {
    const references = extractImageReferences(emberFile.content, emberFile.type);
    updateReferenceStatistics(
      results.statistics, 
      emberFile.type, 
      references.length, 
      emberFile.isTest
    );

    for (const ref of references) {
      processReference(results, ref, imageMatcher, emberFile);
    }
  }

  // Update summary after processing
  results.summary.referencedCount = results.referencedImages.size;
  results.summary.unreferencedCount = results.unreferencedImages.size;
  results.summary.missingCount = results.missingImages.size;
  results.summary.duplicateCount = results.duplicateNames.size;
  results.summary.issues = {
    hasUnreferencedImages: results.unreferencedImages.size > 0,
    hasMissingImages: results.missingImages.size > 0,
    hasAmbiguousReferences: results.duplicateNames.size > 0
  };

  return results;
}