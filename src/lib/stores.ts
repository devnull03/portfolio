import { writable } from "svelte/store";
import { CursorState } from "./interfaces/cursor.interface";

export const isMobile = writable(false);
export const scrollThreshold = writable<number>(10);

export const currentCursorState =  writable<CursorState>(CursorState.Default);

export const crtEffectEnabled = writable<boolean>(true);
