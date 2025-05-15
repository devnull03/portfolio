import { writable } from "svelte/store";

export const isMobile = writable(false);
export const scrollThreshold = writable<number>(10);
