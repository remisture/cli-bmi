#!/usr/bin/env node

import process from 'node:process';
import chalk from 'chalk';
import clear from 'clear';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import message from './message.js';
import { cliOptions } from './cli-options.js';
import { getBMIScore } from './utils.js';

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

export const parseCliOptions = () => {
	const cmdOptions = commandLineArgs(cliOptions, { partial: true });
	const help = Boolean(cmdOptions.help);
	const clear = Boolean(cmdOptions.clear);
	const weight = cmdOptions.weight;
	const height = cmdOptions.height;

	if (help) {
		helpSection();
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
		saveLocalKey(STORAGE_KEYS.HEIGHT, options.height);
		return options.height;
	}

	const answer = await askForHeight(options);
	saveLocalKey(STORAGE_KEYS.HEIGHT, answer.height);
	return answer.height;
};

export const determineWeight = async (options = {}) => {
	if (options.weight) {
		saveLocalKey(STORAGE_KEYS.WEIGHT, options.weight);
		return options.weight;
	}

	const answers = await askForWeight(options);
	saveLocalKey(STORAGE_KEYS.WEIGHT, answers.weight);
	return answers.weight;
};

const askForWeight = async (_options) => {
	const { weight } = await inquirer.prompt({
		type: 'input',
		name: 'weight',
		message: "What's your weight in kilos?",
		default: () => getLocalKey(STORAGE_KEYS.WEIGHT, 0),
	});

	return { weight };
};

const askForHeight = async (_options) => {
	const { height } = await inquirer.prompt({
		type: 'input',
		name: 'height',
		message: "What's your height in centimeters?",
		default: () => getLocalKey(STORAGE_KEYS.HEIGHT, 0),
	});

	return { height };
};

export const calculate = (height, weight) => {
	const heightInMeters = height / 100;
	const bmi = Number(weight) / (Number(heightInMeters) * Number(heightInMeters));
	const score = getBMIScore(bmi);

	return { value: bmi.toFixed(2), score };
};

export const printResults = (height, weight) => {
	const calculation = calculate(height, weight);

	console.log(
		message.info({
			content: [`${weight} kg x ${height} cm = ${calculation.value}`, `You are ${calculation.score?.toLowerCase()}!`],
		})
	);
};

const helpSection = () => {
	printHeading();
	console.log(
		commandLineUsage([
			{
				header: 'Usage',
				content: ['$ bmi [<options>]', '$ bmi', '$ bmi -w 85 -h 180'],
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
