import fs from 'fs/promises';

function formatImageReference(imagePath, info) {
  return {
    path: imagePath,
    size: info.size,
    created: info.created,
    modified: info.modified,
    references: Array.from(info.referencedIn.entries()).map(([file, lines]) => ({
      file,
      lines: Array.from(lines),
      positions: info.positions?.[file] || []
    }))
  };
}

function generateJsonReport(results) {
  const { referencedImages, unreferencedImages, missingImages, duplicateNames, statistics } = results;
  
  return {
    statistics: {
      totalImages: statistics.totalImages,
      totalEmberFiles: statistics.totalEmberFiles,
      totalReferences: statistics.totalReferences,
      imageTypes: Object.fromEntries(statistics.imagesByType)
    },
    referencedImages: Array.from(referencedImages.entries()).map(([path, info]) => 
      formatImageReference(path, info)
    ),
    unreferencedImages: Array.from(unreferencedImages.entries()).map(([path, info]) => ({
      path,
      size: info.size,
      created: info.created,
      modified: info.modified
    })),
    missingImages: Array.from(missingImages),
    duplicateNames: Array.from(duplicateNames.entries()).map(([fileName, info]) => ({
      fileName,
      referencedIn: info.referencedIn,
      position: info.position,
      possibleMatches: info.matches
    })),
    summary: {
      referencedCount: referencedImages.size,
      unreferencedCount: unreferencedImages.size,
      missingCount: missingImages.size,
      duplicateCount: duplicateNames.size,
      issues: {
        hasUnreferencedImages: unreferencedImages.size > 0,
        hasMissingImages: missingImages.size > 0,
        hasAmbiguousReferences: duplicateNames.size > 0
      }
    }
  };
}

export async function saveJsonReport(results, outputPath) {
  const jsonReport = generateJsonReport(results);
  await fs.writeFile(
    outputPath, 
    JSON.stringify(jsonReport, null, 2),
    'utf-8'
  );
  return jsonReport;
}