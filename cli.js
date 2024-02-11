#!/usr/bin/env node

import process from 'node:process';
import { determineHeight, determineWeight, parseCliOptions, printResults } from './lib/lib.js';
import { logError } from './lib/utils.js';

const run = async () => {
	try {
		const cliOptions = await parseCliOptions();
		const height = await determineHeight(cliOptions);
		const weight = await determineWeight(cliOptions);
		printResults(height, weight);
		process.exit(0);
	} catch (error) {
		logError('An error occurred', error?.message);
		process.exit(1);
	}
};

await run();
