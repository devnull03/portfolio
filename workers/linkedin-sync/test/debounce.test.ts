// node --test workers/linkedin-sync/test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fingerprintChanged, fire, signal, status, type DebounceStorage } from '../src/debounce.ts';

const MIN = 60_000;
const config = { debounceMs: 120 * MIN, maxWaitMs: 24 * 60 * MIN };

function memoryStorage(): DebounceStorage & { alarm: number | null } {
	const data = new Map<string, unknown>();
	return {
		alarm: null,
		async get<T>(key: string) {
			return structuredClone(data.get(key)) as T | undefined;
		},
		async put<T>(key: string, value: T) {
			data.set(key, structuredClone(value));
		},
		async delete(key: string) {
			return data.delete(key);
		},
		async getAlarm() {
			return this.alarm;
		},
		async setAlarm(t: number) {
			this.alarm = t;
		},
		async deleteAlarm() {
			this.alarm = null;
		}
	};
}

test('each signal pushes the deadline out by the debounce window', async () => {
	const s = memoryStorage();
	await signal(s, config, 'a', 0);
	assert.equal(s.alarm, 120 * MIN);
	await signal(s, config, 'b', 30 * MIN);
	assert.equal(s.alarm, 150 * MIN);
	const { pending } = await status(s);
	assert.equal(pending?.signals, 2);
	assert.deepEqual(pending?.reasons, ['a', 'b']);
	assert.equal(pending?.pendingSince, 0);
});

test('max wait caps how long a stream of signals can postpone a deploy', async () => {
	const s = memoryStorage();
	for (let t = 0; t <= 23 * 60 * MIN; t += 60 * MIN) await signal(s, config, 'edit', t);
	assert.equal(s.alarm, 24 * 60 * MIN);
});

test('firing dispatches once and clears the pending change', async () => {
	const s = memoryStorage();
	await signal(s, config, 'a', 0);
	await signal(s, config, 'b', MIN);
	const calls: string[][] = [];
	const record = await fire(s, async (p) => (calls.push(p.reasons), 'sent'), 200 * MIN);
	assert.equal(calls.length, 1);
	assert.deepEqual(calls[0], ['a', 'b']);
	assert.equal(record?.ok, true);
	assert.equal(s.alarm, null);
	assert.equal((await status(s)).pending, null);
	assert.equal((await status(s)).lastDispatch?.detail, 'sent');
	// Nothing pending: firing again is a no-op.
	assert.equal(await fire(s, async () => 'sent', 300 * MIN), null);
});

test('a failed dispatch keeps the change pending and rethrows so the alarm retries', async () => {
	const s = memoryStorage();
	await signal(s, config, 'a', 0);
	await assert.rejects(fire(s, async () => Promise.reject(new Error('github down')), 120 * MIN), /github down/);
	const st = await status(s);
	assert.ok(st.pending);
	assert.equal(st.lastDispatch?.ok, false);
	assert.equal(st.lastDispatch?.detail, 'github down');
});

test('a signal that arrives mid-dispatch is not lost', async () => {
	const s = memoryStorage();
	await signal(s, config, 'a', 0);
	await fire(s, async () => {
		await signal(s, config, 'late', 121 * MIN);
		return 'sent';
	}, 120 * MIN);
	const st = await status(s);
	assert.deepEqual(st.pending?.reasons, ['a', 'late']);
	assert.equal(s.alarm, 241 * MIN);
});

test('fingerprints: polled baseline is not a change, uploads are', async () => {
	const s = memoryStorage();
	assert.equal(await fingerprintChanged(s, 'dma', 'x'), false);
	assert.equal(await fingerprintChanged(s, 'dma', 'x'), false);
	assert.equal(await fingerprintChanged(s, 'dma', 'y'), true);
	assert.equal(await fingerprintChanged(s, 'export', 'z', true), true);
	assert.equal(await fingerprintChanged(s, 'export', 'z', true), false);
});
