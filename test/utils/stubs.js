/**
 * Stub functions for testing, extracted from test/test.js
 */

/** Letter stubs. */
export const stubA = () => 'a';
export const stubB = () => 'b';
export const stubC = () => 'c';

/** Boolean stubs. */
export const stubTrue = () => true;
export const stubFalse = () => false;

/** Value stubs. */
export const stubNaN = () => NaN;
export const stubNull = () => null;
export const stubZero = () => 0;
export const stubOne = () => 1;
export const stubTwo = () => 2;
export const stubThree = () => 3;
export const stubFour = () => 4;

/** Object stubs. */
export const stubArray = () => [];
export const stubObject = () => ({});
export const stubString = () => '';

/** Math helpers. */
export const add = (x, y) => x + y;
export const doubled = (n) => n * 2;
export const isEven = (n) => n % 2 == 0;
export const square = (n) => n * n;

/** Utility functions. */
export const identity = (value) => value;
export const noop = () => {};
