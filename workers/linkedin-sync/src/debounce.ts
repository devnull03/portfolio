// Debounce state machine, kept free of Workers APIs so it can be unit-tested in Node.
//
// Every change signal pushes the deadline out to `now + debounce`, so a burst of edits produces a
// single deploy once things have been quiet for the whole window. `maxWait` caps how long a
// constant trickle of signals can postpone it.

export interface DebounceStorage {
	get<T>(key: string): Promise<T | undefined>;
	put<T>(key: string, value: T): Promise<void>;
	delete(key: string): Promise<boolean>;
	getAlarm(): Promise<number | null>;
	setAlarm(scheduledTime: number): Promise<void>;
	deleteAlarm(): Promise<void>;
}

export interface DebounceConfig {
	debounceMs: number;
	maxWaitMs: number;
}

export interface PendingDeploy {
	pendingSince: number;
	lastSignalAt: number;
	signals: number;
	reasons: string[];
}

export interface DispatchRecord {
	at: number;
	ok: boolean;
	detail: string;
	reasons?: string[];
}

export interface Status {
	pending: (PendingDeploy & { firesAt: number | null }) | null;
	lastDispatch: DispatchRecord | null;
}

const PENDING = 'pending';
const LAST_DISPATCH = 'lastDispatch';
const MAX_REASONS = 20;

export async function signal(
	storage: DebounceStorage,
	config: DebounceConfig,
	reason: string,
	now: number
): Promise<{ firesAt: number; pending: PendingDeploy }> {
	const previous = await storage.get<PendingDeploy>(PENDING);
	const pending: PendingDeploy = {
		pendingSince: previous?.pendingSince ?? now,
		lastSignalAt: now,
		signals: (previous?.signals ?? 0) + 1,
		reasons: [...(previous?.reasons ?? []), reason].slice(-MAX_REASONS)
	};
	const firesAt = Math.min(now + config.debounceMs, pending.pendingSince + config.maxWaitMs);

	await storage.put(PENDING, pending);
	await storage.setAlarm(firesAt);
	return { firesAt, pending };
}

/**
 * Called when the alarm fires (or on a manual flush). Runs `dispatch` for the pending change and
 * clears it on success. On failure the error is rethrown so the Durable Object alarm retries
 * with backoff, and the pending change is kept.
 */
export async function fire(
	storage: DebounceStorage,
	dispatch: (pending: PendingDeploy) => Promise<string>,
	now: number
): Promise<DispatchRecord | null> {
	const pending = await storage.get<PendingDeploy>(PENDING);
	if (!pending) return null;

	try {
		const detail = await dispatch(pending);
		const record: DispatchRecord = { at: now, ok: true, detail, reasons: pending.reasons };
		await storage.put(LAST_DISPATCH, record);
		// A signal that arrived while dispatching re-arms the alarm; only clear if nothing new came in.
		const latest = await storage.get<PendingDeploy>(PENDING);
		if (latest?.lastSignalAt === pending.lastSignalAt) {
			await storage.delete(PENDING);
			await storage.deleteAlarm();
		}
		return record;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		await storage.put(LAST_DISPATCH, { at: now, ok: false, detail, reasons: pending.reasons });
		throw error;
	}
}

export async function status(storage: DebounceStorage): Promise<Status> {
	const pending = (await storage.get<PendingDeploy>(PENDING)) ?? null;
	return {
		pending: pending && { ...pending, firesAt: await storage.getAlarm() },
		lastDispatch: (await storage.get<DispatchRecord>(LAST_DISPATCH)) ?? null
	};
}

/**
 * Record a content fingerprint; returns true when it differs from the previous one. For polled
 * sources the first fingerprint is only a baseline; for pushed ones (an upload) it is a change.
 */
export async function fingerprintChanged(
	storage: DebounceStorage,
	key: string,
	value: string,
	firstIsChange = false
): Promise<boolean> {
	const previous = await storage.get<string>(`fingerprint:${key}`);
	if (previous === value) return false;
	await storage.put(`fingerprint:${key}`, value);
	return previous !== undefined || firstIsChange;
}
