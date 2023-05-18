import boxen from 'boxen';

const base = ({ title, content, color = 'white', options = {} }) => {
	const text = Array.isArray(content) ? content.filter(Boolean).join('\n') : content;
	const baseOptions = {
		padding: { top: 1, right: 2, bottom: 1, left: 2 },
		margin: { top: 1, right: 1, bottom: 1, left: 1 },
		borderStyle: 'round',
		titleAlignment: 'center',
		textAlignment: 'left',
		dimBorder: true,
	};
	return boxen(text, {
		...baseOptions,
		...options,
		borderColor: color,
		title,
	});
};

export const error = ({ title, content, options = {} }) => base({ title, content, options, color: 'red' });

export const info = ({ title, content, options = {} }) => base({ title, content, options, color: 'white' });

export const success = ({ title, content, options = {} }) => base({ title, content, options, color: 'green' });

export const warning = ({ title, content, options = {} }) => base({ title, content, options, color: 'green' });

const message = {
	base,
	error,
	info,
	success,
	warning,
};
export default message;
