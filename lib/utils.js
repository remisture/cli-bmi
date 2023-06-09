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

export const isPositiveNumber = (input) => {
	const number = Number(input);
	return !Number.isNaN(number) && number > 0;
};
