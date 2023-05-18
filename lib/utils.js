import chalk from 'chalk';
import boxenMessage from './message.js';

export const logError = (title, content, ...rest) => {
	console.log(
		boxenMessage.error({
			title: chalk.underline(title),
			content: [content, ...rest],
		})
	);
};

export const lookupTable = {
	0: chalk.red('Very severely underweight'),
	15: chalk.red('Severely underweight'),
	16: chalk.yellow('Underweight'),
	18.5: chalk.green('Normal weight'),
	25: chalk.green('Overweight'),
	30: chalk.yellow('Moderate obese'),
	35: chalk.yellow('Severe obese'),
	40: chalk.red('Very severe obese'),
	Infinity: chalk.red('Morbid obese'),
};

export const getBMIScore = (bmi) => {
	const sortedBmiValues = Object.keys(lookupTable).sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b));

	for (const sortedBmiValue of sortedBmiValues) {
		const upperLimit = Number.parseFloat(sortedBmiValue);
		const bmiScore = lookupTable[upperLimit];

		if (bmi <= upperLimit) {
			return bmiScore;
		}
	}

	return 'Invalid BMI';
};
