export const imagePatterns = {
  hbs: [
    {
      type: 'img-src',
      regex: /src=["']((?:\/|(?:\.\.\/)*)?images\/[^'"]+\.(png|jpg|jpeg|gif|svg|webp))["']/g,
      pathIndex: 1
    },
    {
      type: 'style-background',
      regex: /style=["'][^"']*background-image:\s*url\(['"]?((?:\/|(?:\.\.\/)*)?images\/[^'")\s]+\.(png|jpg|jpeg|gif|svg|webp))['"]?\)/g,
      pathIndex: 1
    }
  ],
  css: [
    {
      type: 'url-function',
      regex: /url\(['"]?((?:\/|(?:\.\.\/)*)?images\/[^'")\s]+\.(png|jpg|jpeg|gif|svg|webp))['"]?\)/g,
      pathIndex: 1
    },
    {
      type: 'image-set',
      regex: /image-set\(["']?((?:\/|(?:\.\.\/)*)?images\/[^'")\s]+\.(png|jpg|jpeg|gif|svg|webp))["']?\s+\d+x\)/g,
      pathIndex: 1
    }
  ],
  js: [
    {
      type: 'string-literal',
      regex: /['"`]((?:\/|(?:\.\.\/)*)?images\/[^'"`\s]+\.(png|jpg|jpeg|gif|svg|webp))['"`]/g,
      pathIndex: 1
    },
    {
      type: 'import-statement',
      regex: /import\s+.*?from\s+['"`]((?:\/|(?:\.\.\/)*)?images\/[^'"`\s]+\.(png|jpg|jpeg|gif|svg|webp))['"`]/g,
      pathIndex: 1
    }
  ]
};

export const fileTypeAliases = {
  'hbs': ['hbs', 'html'],
  'css': ['css', 'scss'],
  'js': ['js']
};

export function getPatternsByFileType(fileType) {
  for (const [mainType, aliases] of Object.entries(fileTypeAliases)) {
    if (aliases.includes(fileType)) {
      return imagePatterns[mainType] || [];
    }
  }
  return [];
}