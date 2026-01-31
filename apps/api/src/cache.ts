import type { Run, RunId } from "#utils/schemas";

export const cache: Map<RunId, Run> = new Map();
