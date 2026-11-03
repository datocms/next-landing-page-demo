import Bars from './Bars';
import Chart from './Chart';
import Chat from './Chat';
import Flow from './Flow';
import Lock from './Lock';
import Presence from './Presence';

/**
 * The six wordless gallery drawings (352×200), in the demo's feature order:
 * feature `i` uses MINI_UIS[i % 6] with toneClass(i) on its card.
 */
export const MINI_UIS = [Flow, Bars, Chart, Presence, Lock, Chat] as const;
