import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import { validatePath } from '../utils/pathUtils.js';

export async function parseArguments() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options] <image-path> <ember-app-path>')
    .option('report', {
      alias: 'r',
      describe: 'Specify the output report file path',
      default: './image-validation-report.json',
      type: 'string'
    })
    .demandCommand(2, 'Both image-path and ember-app-path arguments are required')
    .help('h')
    .alias('h', 'help')
    .example('$0 /var/www/images /var/www/ember-app', 'Validate images with default report path')
    .example('$0 ./public/images ./app', 'Validate images in relative paths')
    .example('$0 -r /tmp/report.json /path/to/images /path/to/app', 'Specify custom report path')
    .argv;

  const [imagePath, emberAppPath] = argv._;

  // Validate paths
  await validatePath(imagePath);
  await validatePath(emberAppPath);

  return {
    imagePath: path.resolve(imagePath),
    emberAppPath: path.resolve(emberAppPath),
    reportPath: path.resolve(argv.report)
  };
}