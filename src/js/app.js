import Trello from './Trello';

const cardmanager = new Trello(document.querySelector('.cardmanager'));
cardmanager.bindToDOM();
cardmanager.cards = [
  [
    'Do homework',
    'Do laundry',
  ],
  [
    'Read book',
  ],
  [
    'Wash dish',
    'Make dinner',
  ],
];

cardmanager.renderingItem();
