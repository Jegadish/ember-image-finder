import { getPatternsByFileType } from '../patterns/imagePatterns.js';

export function extractImageReferences(content, fileType) {
  const references = [];
  const lines = content.split('\n');
  const patterns = getPatternsByFileType(fileType);

  for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
    const line = lines[lineNumber - 1];
    
    for (const pattern of patterns) {
      const matches = Array.from(line.matchAll(pattern.regex));
      for (const match of matches) {
        const fullPath = match[pattern.pathIndex].startsWith('/images/') 
          ? match[pattern.pathIndex]
          : `/images/${match[pattern.pathIndex].replace(/^(?:\.\.\/)*images\//, '')}`;

        references.push({
          fullPath,
          fileName: match[pattern.pathIndex].split('/').pop(),
          position: {
            line: lineNumber,
            column: match.index,
            length: match[0].length,
            type: pattern.type
          }
        });
      }
    }
  }

  return references;
}