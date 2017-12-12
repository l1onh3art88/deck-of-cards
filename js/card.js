import { el } from 'redom';
import { tween } from './animation';

const SUITS = 'spades hearts clubs diamonds jokers'.split(' ');
const VALUES = 'a 2 3 4 5 6 7 8 9 10 j q k'.split(' ');

export default class Card {
  constructor (i) {
    const suit = i / 13 | 0;
    const value = i % 13;
    const img = `img/${SUITS[suit]}/${suit < 4 ? VALUES[value] : (value + 1)}.svg`;

    this.i = i;
    this.suit = suit;
    this.value = value;
    this.img = img;
    this.stack = true;

    this.data = {};

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.r = 0;
    this.d = 0.25;

    this.el = el('.card', {
      style: {
        backgroundImage: `url(${img})`
      }
    });
  }
  set (data) {
    for (const key in data) {
      this[key] = data[key];
    }
    this.render();
    return this;
  }
  tween ({ delay = 0, duration = 0, ease, from, to, precision, stack, onend }) {
    this.stack = stack;
    tween(this, {
      delay,
      duration,
      ease,
      from,
      to,
      precision,
      onend
    });
    return this;
  }
  render () {
    const { x, y, z, r } = this;
    const translate = `translate(${x}px, ${y}px)`;
    const rotate = r ? ` rotate(${r}deg)` : '';
    this.el.style.transform = translate + rotate;
    this.el.style.zIndex = z;
    return this;
  }
}
