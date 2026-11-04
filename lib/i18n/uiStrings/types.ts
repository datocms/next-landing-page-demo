import type { en } from './en';

/** A count-dependent string, chosen with Intl.PluralRules from `vars.n` */
type Plural = { one: string; other: string };
export type Entry = string | Plural;

export type UiStringKey = keyof typeof en;

/** Every locale has the same keys as `en`, and a plural key stays plural */
export type Dictionary = {
  [Key in UiStringKey]: (typeof en)[Key] extends Plural ? Plural : string;
};
