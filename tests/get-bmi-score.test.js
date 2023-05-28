import test from 'ava';
import { getBMIScore } from '../lib/lib.js';

// Tests for defined ranges in lookupTable
test('getBMIScore returns correct score for BMI values within defined ranges', (t) => {
	t.is(getBMIScore(15).includes('Underweight (severe thinness)'), true);
	t.is(getBMIScore(16.5).includes('Underweight (moderate thinness)'), true);
	t.is(getBMIScore(18).includes('Underweight (mild thinness)'), true);
	t.is(getBMIScore(20).includes('Normal weight'), true);
	t.is(getBMIScore(27).includes('Overweight'), true);
	t.is(getBMIScore(32).includes('Obese (class I)'), true);
	t.is(getBMIScore(37).includes('Obese (class II)'), true);
	t.is(getBMIScore(42).includes('Obese (class III)'), true);
});

test('getBMIScore returns "Invalid BMI" for NaN', (t) => {
	t.is(getBMIScore(Number.NaN), 'Invalid BMI');
});

test('getBMIScore correctly handles numeric strings', (t) => {
	t.is(getBMIScore('20').includes('Normal weight'), true);
});

test('getBMIScore returns "Invalid BMI" for non-numeric strings', (t) => {
	t.is(getBMIScore('hello'), 'Invalid BMI');
});

test('getBMIScore returns "Invalid BMI" for null input', (t) => {
	t.is(getBMIScore(null), 'Invalid BMI');
});

test('getBMIScore returns "Invalid BMI" for undefined input', (t) => {
	t.is(getBMIScore(undefined), 'Invalid BMI');
});
