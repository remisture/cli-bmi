import test from 'ava';
import { calculate } from '../lib/lib.js';

test('calculate correctly handles valid inputs and returns correct BMI and score', (t) => {
	const result = calculate(170, 70); // BMI: 24.22, Normal weight
	t.is(result.value, '24.22');
	t.is(result.score.includes('Normal weight'), true);
});

test('calculate correctly handles underweight', (t) => {
	const result = calculate(180, 50); // BMI: 15.43, Underweight (severe thinness)
	t.is(result.value, '15.43');
	t.is(result.score.includes('Underweight (severe thinness)'), true);
});

test('calculate correctly handles overweight', (t) => {
	const result = calculate(160, 80); // BMI: 31.25, Obese (class I)
	t.is(result.value, '31.25');
	t.is(result.score.includes('Obese (class I)'), true);
});

test('calculate returns "Invalid BMI" for zero or negative height or weight', (t) => {
	const result1 = calculate(0, 70);
	t.is(result1.score, 'Invalid BMI');

	const result2 = calculate(170, 0);
	t.is(result2.score, 'Invalid BMI');

	const result3 = calculate(-170, 70);
	t.is(result3.score, 'Invalid BMI');

	const result4 = calculate(170, -70);
	t.is(result4.score, 'Invalid BMI');
});

test('calculate returns "Invalid BMI" for non-numeric height or weight', (t) => {
	const result1 = calculate('hello', 70);
	t.is(result1.score, 'Invalid BMI');

	const result2 = calculate(170, 'hello');
	t.is(result2.score, 'Invalid BMI');
});
