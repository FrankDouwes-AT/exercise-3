import type { NuxtError } from "#app";

export type TState = {
    loading: boolean,
    error?: Error | NuxtError<undefined> | null,
    cycling: boolean,
    customInputVisible: boolean,
    cycleCount: number
}

export type TSelectOption = {
    label: string,
    value?: string
}