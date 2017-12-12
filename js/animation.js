/* global requestAnimationFrame */

import * as easing from './ease';

const queue = [];
let requested = false;
let rendering = false;
const tweens = [];

export function tick (handler, inner) {
  queue.push(handler);

  if (rendering) {
    if (requested) {
      return;
    } else {
      requested = true;
    }
  } else {
    rendering = requestAnimationFrame(onRender);
  }
}

function onRender (time) {
  const len = queue.length;
  for (let i = 0; i < len; i++) {
    queue[i](time);
  }
  queue.splice(0, len);
  if (requested) {
    requested = false;
    rendering = requestAnimationFrame(onRender);
  } else {
    rendering = false;
  }
}

function iterate (time) {
  for (let i = 0; i < tweens.length; i++) {
    const tween = tweens[i];
    const { startTime, duration, endTime, target, from, diff, ease, precision } = tween;

    if (time < startTime) {
      continue;
    }

    const t = (time < endTime) ? ((time - startTime) / duration) : 1;
    const e = easing[ease] ? easing[ease](t) : t;

    for (const key in from) {
      const value = from[key] + diff[key] * e;

      if (precision[key]) {
        target[key] = parseFloat(value.toFixed(precision[key]));
      } else if (key in precision) {
        target[key] = Math.round(value);
      } else {
        target[key] = value;
      }
    }

    target.render && target.render();

    if (time > tween.endTime) {
      tweens.splice(i--, 1);
      tween.onend && tween.onend();
    }
  }

  if (tweens.length) {
    tick(iterate);
  }
}

export function tween (target, { delay, duration, from = {}, to = {}, ease = 'linear', precision = {}, onend }) {
  tick((time) => {
    const startTime = time + delay;
    const endTime = startTime + duration;
    const diff = {};

    for (const key in from) {
      const toHas = key in to;

      if (!toHas) {
        to[key] = target[key];
      }
    }

    for (const key in to) {
      const fromHas = key in from;

      if (!fromHas) {
        from[key] = target[key];
      }

      diff[key] = to[key] - from[key];
    }

    const tween = {
      startTime,
      duration,
      endTime,
      ease,
      from,
      diff,
      precision,
      target,
      onend
    };

    if (!tweens.length) {
      tick(iterate);
    }
    tweens.push(tween);
  });
}
