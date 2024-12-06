import { parseArguments } from './cli/arguments.js';
import { validateImages } from './core/validator.js';
import { saveJsonReport } from './reporters/jsonReporter.js';
import chalk from 'chalk';

async function main() {
  try {
    const options = await parseArguments();
    
    console.log(chalk.blue(`Scanning for images in: ${options.imagePath}`));
    console.log(chalk.blue(`Scanning Ember app in: ${options.emberAppPath}`));

    const results = await validateImages(options.imagePath, options.emberAppPath);
    await saveJsonReport(results, options.reportPath);
    
    console.log(chalk.green(`\nJSON report saved to: ${options.reportPath}`));

    if (results.summary.issues.hasUnreferencedImages) {
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

main();