export function initializeStatistics(imageFiles) {
  const statistics = {
    totalImages: imageFiles.size,
    totalEmberFiles: 0,
    totalReferences: 0,
    imagesByType: new Map(),
    referencesByFileType: new Map(),
    referencesByCategory: {
      app: 0,
      tests: 0
    }
  };

  // Initialize image type statistics
  for (const imageInfo of imageFiles.values()) {
    const ext = imageInfo.extension.slice(1);
    statistics.imagesByType.set(ext, (statistics.imagesByType.get(ext) || 0) + 1);
  }

  return statistics;
}

export function updateReferenceStatistics(statistics, fileType, referenceCount, isTest) {
  // Update file type statistics
  if (!statistics.referencesByFileType.has(fileType)) {
    statistics.referencesByFileType.set(fileType, 0);
  }
  
  statistics.referencesByFileType.set(
    fileType,
    statistics.referencesByFileType.get(fileType) + referenceCount
  );
  
  // Update category statistics
  if (isTest) {
    statistics.referencesByCategory.tests += referenceCount;
  } else {
    statistics.referencesByCategory.app += referenceCount;
  }
  
  statistics.totalReferences += referenceCount;
}