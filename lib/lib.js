#!/usr/bin/env node

import process from 'node:process';
import { dirname, join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import clear from 'clear';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import figlet from 'figlet';
import input from '@inquirer/input';
import { LocalStorage } from 'node-localstorage';
import message from './message.js';
import { cliOptions, commonCliSectionUsage } from './cli-options.js';
import { isPositiveNumber } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORAGE_PATH = './storage-data';
const STORAGE_NAME = 'data';
const STORAGE_KEYS = {
	HEIGHT: 'height',
	WEIGHT: 'weight',
};

const localStorage = new LocalStorage(STORAGE_PATH);

const getLocalObject = () => JSON.parse(localStorage.getItem(STORAGE_NAME)) || {};
const getLocalKey = (key, defaultValue) => {
	const value = getLocalObject()[key];
	return value === undefined ? defaultValue : value;
};

const saveLocalKey = (key, value) => {
	const existingData = getLocalObject();
	localStorage.setItem(STORAGE_NAME, JSON.stringify({ ...existingData, [key]: value }, null, 2));
};

const clearStorage = () => {
	console.log(' ');
	localStorage.clear();
	console.log(chalk.green('Local data removed!'));
	console.log(' ');
};

export const parseCliOptions = async () => {
	const cmdOptions = commandLineArgs(cliOptions, { partial: true });
	const help = Boolean(cmdOptions.help);
	const version = Boolean(cmdOptions.version);
	const clear = Boolean(cmdOptions.clear);
	const weight = cmdOptions.weight;
	const height = cmdOptions.height;

	if (help) {
		helpSection();
		process.exit(0);
		return;
	}

	if (version) {
		await getVersion();
		process.exit(0);
		return;
	}

	if (clear) {
		clearStorage();
	}

	return { weight, height };
};

export const determineHeight = async (options = {}) => {
	if (options.height) {
		if (!isPositiveNumber(options.height)) {
			throw new TypeError('Height must be a positive number');
		}

		saveLocalKey(STORAGE_KEYS.HEIGHT, options.height);
		return options.height;
	}

	const height = await askForHeight(options);
	saveLocalKey(STORAGE_KEYS.HEIGHT, height);
	return height;
};

export const determineWeight = async (options = {}) => {
	if (options.weight) {
		if (!isPositiveNumber(options.weight)) {
			throw new TypeError(`Invalid weight: "${options.weight}". Weight must be a positive number`);
		}

		saveLocalKey(STORAGE_KEYS.WEIGHT, options.weight);
		return options.weight;
	}

	const weight = await askForWeight(options);
	saveLocalKey(STORAGE_KEYS.WEIGHT, weight);
	return weight;
};

const askForWeight = async (_options) => {
	return input({
		type: 'input',
		name: 'weight',
		message: "What's your weight in kilos?",
		validate: (value) => isPositiveNumber(value) || 'Weight must be a positive number',
		default: () => getLocalKey(STORAGE_KEYS.WEIGHT, 0),
	});
};

const askForHeight = async (_options) => {
	return input({
		type: 'input',
		name: 'height',
		message: "What's your height in centimeters?",
		validate: (value) => isPositiveNumber(value) || 'Height must be a positive number',
		default: () => getLocalKey(STORAGE_KEYS.HEIGHT, 0),
	});
};

export const calculate = (height, weight) => {
	if (height <= 0 || weight <= 0 || Number.isNaN(Number(height)) || Number.isNaN(Number(weight))) {
		return { value: 'NaN', score: 'Invalid BMI' };
	}

	const heightInMeters = height / 100;
	const bmi = Number(weight) / (Number(heightInMeters) * Number(heightInMeters));
	const score = getBMIScore(bmi);

	return { value: bmi.toFixed(2), score };
};

export const printResults = (height, weight) => {
	const calculation = calculate(height, weight);

	console.log(
		message.info({
			content: [`${weight} kg @ ${height} cm = ${calculation.value}`, ' ', chalk.underline(calculation.score)],
			options: { textAlignment: 'center' },
		})
	);
};

const helpSection = () => {
	printHeading();
	console.log(
		commandLineUsage([
			{
				header: 'Usage',
				content: ['$ bmi [<options>]', '$ bmi', '$ bmi --weight 85 --height 180', ...commonCliSectionUsage('bmi')],
			},
			{ header: 'Commands', optionList: cliOptions },
			{ content: 'A cli tool by Remi Sture' },
		])
	);
};

export const printHeading = () => {
	clear();
	console.log(' ');
	console.log(chalk.yellow(figlet.textSync('BMI', { horizontalLayout: 'full' })));
	console.log(' ');
};

export const lookupTable = [
	{ range: [Number.NEGATIVE_INFINITY, 16], score: chalk.red('Underweight (severe thinness)') },
	{ range: [16, 17], score: chalk.red('Underweight (moderate thinness)') },
	{ range: [17, 18.5], score: chalk.yellow('Underweight (mild thinness)') },
	{ range: [18.5, 25], score: chalk.green('Normal weight') },
	{ range: [25, 30], score: chalk.yellow('Overweight') },
	{ range: [30, 35], score: chalk.red('Obese (class I)') },
	{ range: [35, 40], score: chalk.red('Obese (class II)') },
	{ range: [40, Number.POSITIVE_INFINITY], score: chalk.red('Obese (class III)') },
];

export const getBMIScore = (bmi) => {
	const bmiAsNumber = Number(bmi);

	if (bmi === null || bmi === undefined || Number.isNaN(bmiAsNumber)) {
		return 'Invalid BMI';
	}

	for (const { range, score } of lookupTable) {
		const [lowerLimit, upperLimit] = range;

		if (bmiAsNumber >= lowerLimit && bmiAsNumber < upperLimit) {
			return score;
		}
	}

	return 'Invalid BMI';
};

export const getVersion = async () => {
	const packageJsonPath = join(__dirname, '../package.json');
	try {
		const packageJson = await readFile(packageJsonPath, 'utf8');
		const packageObject = JSON.parse(packageJson);
		console.log(packageObject.version);
		return packageObject.version;
	} catch {
		console.error("Couldn't find package.json");
	}
};
