// Decorative (aria-hidden) drawings shared by the sections: thread bundles and the ShapeDef
// tools to declare new ones, the mini-UI illustrations, the presence pill and the squiggle.
// Client islands import Segments from its own file

export { MINI_UIS } from './MiniUi';
export { default as Bars } from './MiniUi/Bars';
export { default as Chart } from './MiniUi/Chart';
export { default as Lock } from './MiniUi/Lock';
export { default as PresencePill } from './PresencePill';
export { default as Squiggle } from './Squiggle';
export { default as Threads } from './Threads';
export { roundToHundredths, type ShapeDef, STOPS } from './threadShapes';
