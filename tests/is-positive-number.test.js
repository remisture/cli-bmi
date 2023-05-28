import test from 'ava';
import { isPositiveNumber } from '../lib/utils.js';

test('isPositiveNumber returns true for positive numbers', (t) => {
	t.true(isPositiveNumber(42));
});

test('isPositiveNumber returns false for zero', (t) => {
	t.false(isPositiveNumber(0));
});

test('isPositiveNumber returns false for negative numbers', (t) => {
	t.false(isPositiveNumber(-42));
});

test('isPositiveNumber returns false for NaN', (t) => {
	t.false(isPositiveNumber(Number.NaN));
});

test('isPositiveNumber returns true for numeric strings representing positive numbers', (t) => {
	t.true(isPositiveNumber('42'));
});

test('isPositiveNumber returns false for non-numeric strings', (t) => {
	t.false(isPositiveNumber('hello'));
});
