import chalk from 'chalk';
import fs from 'fs/promises';

function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function generateTextReport(results) {
  const { referencedImages, unreferencedImages, missingImages, statistics } = results;
  const lines = [];

  // Title
  lines.push('Image Reference Validation Report');
  lines.push('================================\n');

  // Statistics Section
  lines.push('Statistics:');
  lines.push('-----------');
  lines.push(`Total Images Found: ${statistics.totalImages}`);
  lines.push(`Total Ember Files Scanned: ${statistics.totalEmberFiles}`);
  lines.push(`Total Image References: ${statistics.totalReferences}\n`);
  
  lines.push('Image Types Distribution:');
  for (const [type, count] of statistics.imagesByType) {
    lines.push(`  ${type}: ${count}`);
  }
  lines.push('');

  // Referenced Images Section
  lines.push('Referenced Images:');
  lines.push('----------------');
  if (referencedImages.size === 0) {
    lines.push('No referenced images found');
  } else {
    for (const [imagePath, info] of referencedImages) {
      lines.push(`✓ ${imagePath}`);
      lines.push(`  Size: ${formatFileSize(info.size)}`);
      lines.push('  Referenced in:');
      for (const [file, lineNums] of info.referencedIn) {
        lines.push(`    ${file} (lines: ${Array.from(lineNums).join(', ')})`);
      }
      lines.push('');
    }
  }

  // Unreferenced Images Section
  lines.push('Unreferenced Images:');
  lines.push('------------------');
  if (unreferencedImages.size === 0) {
    lines.push('All images are referenced');
  } else {
    for (const [imagePath, info] of unreferencedImages) {
      lines.push(`! ${imagePath}`);
      lines.push(`  Size: ${formatFileSize(info.size)}`);
    }
  }
  lines.push('');

  // Missing Images Section
  lines.push('Missing Images:');
  lines.push('--------------');
  if (missingImages.size === 0) {
    lines.push('No missing image references');
  } else {
    for (const imagePath of missingImages) {
      lines.push(`✗ ${imagePath}`);
    }
  }
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push('--------');
  lines.push(`Referenced Images: ${referencedImages.size}`);
  lines.push(`Unreferenced Images: ${unreferencedImages.size}`);
  lines.push(`Missing References: ${missingImages.size}`);
  lines.push('');
  
  // Potential Issues
  if (unreferencedImages.size > 0 || missingImages.size > 0) {
    lines.push('Potential Issues:');
    lines.push('----------------');
    if (unreferencedImages.size > 0) {
      lines.push('- You have unreferenced images that might be unused');
    }
    if (missingImages.size > 0) {
      lines.push('- There are missing images referenced in your code');
    }
  }

  return lines.join('\n');
}

export async function saveReport(results, outputPath) {
  const report = generateTextReport(results);
  await fs.writeFile(outputPath, report, 'utf-8');
  console.log(chalk.green(`\nReport saved to: ${outputPath}`));
  return report;
}

export function generateReport(results) {
  // Only generate the text report and save it, no console output
  return generateTextReport(results);
}