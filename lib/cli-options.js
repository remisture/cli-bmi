export const cliOptions = [
	{ name: 'height', type: Number, description: 'Height in centimeters, e.g. 180' },
	{ name: 'weight', type: Number, description: 'Weight in kilos, e.g. 85' },
	{ name: 'clear', alias: 'c', type: Boolean, description: 'Clear local data' },
	{ name: 'help', alias: 'h', type: Boolean, description: 'Displays this usage guide.' },
	{ name: 'version', alias: 'v', type: Boolean, description: 'Displays the version of the cli' },
];

export const commonCliSectionUsage = (command) => [`$ ${command} {bold -h}`, `$ ${command} {bold -v}`];
