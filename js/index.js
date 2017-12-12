import Deck from './deck';
import Card from './card';

const deck = new Deck({
  width: 10,
  height: 6
});

for (let i = 0; i < 55; i++) {
  const card = new Card(i);

  deck.unshift(card);
}

deck.cards.reverse();
deck.stack().wait(500).shuffle().shuffle().shuffle().bySuit();

deck.mount(document.body);
