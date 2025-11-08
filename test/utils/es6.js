/**
 * ES6+ feature instances for testing, extracted from test/test.js
 */

/** ES6+ constructors (may be undefined in older environments). */
export const ArrayBufferCtor = globalThis.ArrayBuffer;
export const BufferCtor = globalThis.Buffer;
export const MapCtor = globalThis.Map;
export const PromiseCtor = globalThis.Promise;
export const ProxyCtor = globalThis.Proxy;
export const SetCtor = globalThis.Set;
export const SymbolCtor = globalThis.Symbol;
export const Uint8ArrayCtor = globalThis.Uint8Array;
export const WeakMapCtor = globalThis.WeakMap;
export const WeakSetCtor = globalThis.WeakSet;

/** ES6+ feature instances (undefined if not supported). */
export const arrayBuffer = ArrayBufferCtor ? new ArrayBufferCtor(2) : undefined;
export const map = MapCtor ? new MapCtor : undefined;
export const promise = PromiseCtor ? PromiseCtor.resolve(1) : undefined;
export const set = SetCtor ? new SetCtor : undefined;
export const symbol = SymbolCtor ? SymbolCtor('a') : undefined;
export const weakMap = WeakMapCtor ? new WeakMapCtor : undefined;
export const weakSet = WeakSetCtor ? new WeakSetCtor : undefined;
