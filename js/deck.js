import { el, mount } from 'redom';

function unqueue (target, queue) {
  const job = queue.shift();

  job(() => {
    if (queue.length) {
      unqueue(target, queue);
    } else {
      target.queueing = false;
    }
  });
}

export default class Deck {
  constructor () {
    this.el = el('.deck');
    this.cards = [];
    this.queued = [];
    this.queueing = false;
  }
  mount (parent) {
    mount(parent, this);
    return this;
  }
  queue (job) {
    this.queued.push(job);
    if (this.queueing) {
      return this;
    }
    this.queueing = true;
    unqueue(this, this.queued);
    return this;
  }
  stack () {
    return this.queue((next) => {
      this.cards.forEach((card, i) => {
        card.set({ x: -i * card.d, y: -i * card.d, z: i });
      });
      next();
    });
  }
  wait (time) {
    return this.queue((next) => setTimeout(() => next(), time));
  }
  shuffle () {
    return this.queue((next) => {
      this.cards.forEach((card, i) => {
        const dir = (Math.random() < 0.5) ? 1 : -1;
        const x = dir * (Math.random() * 50 + 50);

        card.tween({
          delay: i * 2,
          duration: 225,
          ease: 'quadInOut',
          to: {
            x
          },
          precision: {
            x: 1
          },
          onend: () => {
            if (i === 0) {
              next();
            }
          }
        });
      });
    }).queue((next) => {
      const last = this.cards.length - 1;
      this.cards.sort((a, b) => Math.random() - 0.5);
      this.cards.forEach((card, i) => {
        card.tween({
          delay: i * 2,
          duration: 225,
          ease: 'quadInOut',
          to: {
            x: -i * card.d,
            y: -i * card.d,
            z: i
          },
          precision: {
            x: 1,
            y: 1,
            z: 0
          },
          onend: () => {
            if (i === last) {
              next();
            }
          }
        });
      });
    });
  }
  bySuit () {
    return this.queue((next) => {
      this.cards.forEach((card, i) => {
        card.tween({
          delay: 500 + i * 30,
          duration: 500,
          ease: 'quartInOut',
          to: {
            x: (card.value - 6) * 125,
            y: (card.suit - 1.5) * 180
          },
          precision: {
            x: 2,
            y: 2,
            z: 0
          }
        });
      });
    });
  }
  unshift (card) {
    this.cards.unshift(card);
    this.cards.forEach((card, i) => {
      card.set({
        z: i
      });
    });
    mount(this, card, this.cards[1]);
    return this;
  }
  push (card) {
    const z = this.cards.length;
    card.set({
      z
    });
    this.cards.push(card);
    mount(this, card);
    return this;
  }
}
