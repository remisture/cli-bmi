import { determineHeight, determineWeight, parseCliOptions, printResults } from './lib/lib.js';
import { logError } from './lib/utils.js';

(async () => {
	try {
		const cliOptions = parseCliOptions();
		const height = await determineHeight(cliOptions);
		const weight = await determineWeight(cliOptions);
		printResults(height, weight);
		process.exit(0);
	} catch (e) {
		logError('An error occurred', e?.message);
		process.exit(1);
	}
})();
