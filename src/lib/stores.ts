import { writable } from "svelte/store";
import { CrtEffectBlendMode, CursorState } from "./interfaces/sys.interface";

export const isMobile = writable(false);
export const scrollThreshold = writable<number>(10);

export const currentCursorState =  writable<CursorState>(CursorState.Default);

export const crtEffectEnabled = writable<boolean>(true);
export const crtEffectBlendMode = writable<CrtEffectBlendMode>(CrtEffectBlendMode.Overlay);
