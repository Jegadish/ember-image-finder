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
      positions: info.positions[file] || []
    }))
  };
}

function formatResults(results) {
  return {
    statistics: {
      totalImages: results.statistics.totalImages,
      totalEmberFiles: results.statistics.totalEmberFiles,
      totalReferences: results.statistics.totalReferences,
      imageTypes: Object.fromEntries(results.statistics.imagesByType),
      referencesByFileType: Object.fromEntries(results.statistics.referencesByFileType),
      referencesByCategory: results.statistics.referencesByCategory
    },
    referencedImages: Array.from(results.referencedImages.entries()).map(([path, info]) => 
      formatImageReference(path, info)
    ),
    unreferencedImages: Array.from(results.unreferencedImages.entries()).map(([path, info]) => ({
      path,
      size: info.size,
      created: info.created,
      modified: info.modified
    })),
    missingImages: Array.from(results.missingImages),
    duplicateNames: Array.from(results.duplicateNames.entries()).map(([fileName, info]) => ({
      fileName,
      referencedIn: info.referencedIn,
      position: info.position,
      matches: info.matches
    })),
    summary: results.summary
  };
}

export async function saveJsonReport(results, outputPath) {
  const jsonReport = formatResults(results);
  await fs.writeFile(
    outputPath, 
    JSON.stringify(jsonReport, null, 2),
    'utf-8'
  );
  return jsonReport;
}