export function processReference(results, ref, imageMatcher, emberFile) {
  const matchByPath = imageMatcher.findByPath(ref.fullPath);
  const matchesByName = imageMatcher.findByName(ref.fileName);
  
  if (matchByPath) {
    addReference(results, matchByPath.originalPath, matchByPath.info, emberFile, ref.position);
    return true;
  } 
  
  if (matchesByName?.length > 0) {
    if (matchesByName.length === 1) {
      const match = matchesByName[0];
      addReference(results, match.originalPath, match.info, emberFile, ref.position);
      return true;
    } 
    results.duplicateNames.set(ref.fileName, {
      referencedIn: emberFile.relativePath,
      position: ref.position,
      matches: matchesByName.map(m => m.originalPath)
    });
  } else {
    results.missingImages.add(ref.fullPath);
  }
  
  return false;
}

export function addReference(results, imagePath, imageInfo, emberFile, position) {
  if (!results.referencedImages.has(imagePath)) {
    results.referencedImages.set(imagePath, {
      ...imageInfo,
      referencedIn: new Map(),
      positions: {}
    });
  }
  
  const imageRef = results.referencedImages.get(imagePath);
  if (!imageRef.referencedIn.has(emberFile.relativePath)) {
    imageRef.referencedIn.set(emberFile.relativePath, new Set());
    imageRef.positions[emberFile.relativePath] = [];
  }
  
  imageRef.referencedIn.get(emberFile.relativePath).add(position.line);
  imageRef.positions[emberFile.relativePath].push(position);
  
  results.unreferencedImages.delete(imagePath);
}