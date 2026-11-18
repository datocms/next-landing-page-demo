'use client';

import { type ReactNode, useEffect, useRef } from 'react';

type Props = {
  className?: string;
  label: string;
  children: ReactNode;
};

/** How far a press must move before it becomes a drag, in pixels */
const DRAG_THRESHOLD = 4;
/** After a fling, the speed keeps this share of itself every 16ms */
const FRICTION = 0.92;
/** The fastest fling, in pixels per millisecond */
const MAX_SPEED = 2.5;

/**
 * Moves one drift layer by `delta` pixels along its axis. Its animation's timeline
 * covers `span` pixels, so the move is a jump in its current time, wrapped into one
 * loop. Under reduced motion there is no animation (styles/base.css ends them all),
 * so the layer takes the offset itself, wrapped the same way. The plane is seamless,
 * so any position shows a full window.
 */
const shift = (
  layer: HTMLElement | null,
  axis: 'x' | 'y',
  span: number,
  delta: number,
) => {
  if (!layer || !span) return;
  const animation = layer.getAnimations()[0];
  const duration = Number(animation?.effect?.getComputedTiming().duration);
  if (animation && duration) {
    const time = Number(animation.currentTime ?? 0) - (delta / span) * duration;
    animation.currentTime = ((time % duration) + duration) % duration;
    return;
  }
  // From 0 to -span, like the animation
  const offset =
    (((Number(layer.dataset.offset ?? 0) + delta) % span) - span) % span;
  layer.dataset.offset = String(offset);
  layer.style.translate = axis === 'x' ? `${offset}px 0` : `0 ${offset}px`;
};

const clampSpeed = (speed: number) =>
  Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed));

/**
 * The wall's window: focusable (focus pauses the drift, so keyboard users can stop
 * it), and marked `data-paused` while it is off screen or the tab is hidden, which
 * pauses the CSS animation. Click and drag (or swipe sideways) moves the plane: the
 * drag scrubs the two drift animations (`data-drift`), and a quick release lets it
 * glide to a stop. `data-dragging` holds the drift while the hand moves it.
 */
const WallWindow = ({ className, label, children }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let offscreen = false;
    const update = () => {
      node.toggleAttribute('data-paused', offscreen || document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      update();
    });
    observer.observe(node);
    document.addEventListener('visibilitychange', update);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let drag: {
      id: number;
      x: number;
      y: number;
      time: number;
      moved: boolean;
      vx: number;
      vy: number;
    } | null = null;
    let glide = 0;
    let dragged = false;

    const move = (dx: number, dy: number) => {
      const planeX = node.querySelector<HTMLElement>('[data-drift="x"]');
      const planeY = node.querySelector<HTMLElement>('[data-drift="y"]');
      // The horizontal layer holds two tiles side by side: one loop is half its width
      shift(planeX, 'x', (planeX?.offsetWidth ?? 0) / 2, dx);
      shift(planeY, 'y', planeY?.offsetHeight ?? 0, dy);
    };
    const release = () => node.removeAttribute('data-dragging');

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      cancelAnimationFrame(glide);
      release();
      dragged = false;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        moved: false,
        vx: 0,
        vy: 0,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        drag.moved = true;
        try {
          node.setPointerCapture(event.pointerId);
        } catch {
          // The pointer is already gone: the drag still follows the moves that arrive
        }
        node.setAttribute('data-dragging', '');
      }
      const elapsed = Math.max(event.timeStamp - drag.time, 1);
      drag.vx = 0.8 * (dx / elapsed) + 0.2 * drag.vx;
      drag.vy = 0.8 * (dy / elapsed) + 0.2 * drag.vy;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.time = event.timeStamp;
      move(dx, dy);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const { moved, time } = drag;
      let vx = clampSpeed(drag.vx);
      let vy = clampSpeed(drag.vy);
      drag = null;
      if (!moved) return;
      dragged = true;
      // A hand that rested before letting go, a cancelled touch or reduced motion: no glide
      if (
        event.type === 'pointercancel' ||
        event.timeStamp - time > 80 ||
        reducedMotion.matches
      ) {
        release();
        return;
      }
      let last = performance.now();
      const step = (now: number) => {
        const elapsed = Math.min(now - last, 50);
        last = now;
        move(vx * elapsed, vy * elapsed);
        const decay = FRICTION ** (elapsed / 16);
        vx *= decay;
        vy *= decay;
        if (Math.hypot(vx, vy) > 0.02) glide = requestAnimationFrame(step);
        else release();
      };
      glide = requestAnimationFrame(step);
    };

    // A drag ends without the click it would fire on the card under the pointer
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };
    // No text selection, image ghost or focus from a mouse press: the hover already pauses
    const onMouseDown = (event: MouseEvent) => event.preventDefault();
    const onDragStart = (event: DragEvent) => event.preventDefault();

    node.addEventListener('pointerdown', onPointerDown);
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerup', onPointerUp);
    node.addEventListener('pointercancel', onPointerUp);
    node.addEventListener('click', onClick, true);
    node.addEventListener('mousedown', onMouseDown);
    node.addEventListener('dragstart', onDragStart);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      cancelAnimationFrame(glide);
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerUp);
      node.removeEventListener('pointercancel', onPointerUp);
      node.removeEventListener('click', onClick, true);
      node.removeEventListener('mousedown', onMouseDown);
      node.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: focusing the moving region pauses it (WCAG 2.2.2)
    <section ref={ref} className={className} aria-label={label} tabIndex={0}>
      {children}
    </section>
  );
};

export default WallWindow;
