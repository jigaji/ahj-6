import DND from './DND';

export default class Trello {
  constructor(element) {
    this.columns = [...element.querySelectorAll('.cardmanager-col__list')];
    this.composer = element.querySelectorAll('.cardmanager-col__composer');
    this.cards = [];
    this.sortable = new DND();

    this.addItem = this.addItem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFormCancel = this.onFormCancel.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.fromLocalStorage = this.fromLocalStorage.bind(this);
    this.toLocalSrorage = this.toLocalSrorage.bind(this);
    this.onStartDrag = this.sortable.onStartDrag.bind(this);
    this.onDrag = this.sortable.onDrag.bind(this);
    this.onFinishDrag = this.sortable.onFinishDrag.bind(this);
    this.takePlace = this.sortable.takePlace.bind(this);
    this.removePlace = this.sortable.removePlace.bind(this);
    this.onStopDrag = this.sortable.onStopDrag.bind(this);
  }

  bindToDOM() {
    document.addEventListener('DOMContentLoaded', this.fromLocalStorage);
    window.addEventListener('beforeunload', this.toLocalSrorage);

    this.renderingItem();

    this.composer.forEach((el) => el.addEventListener('click', this.addItem));
    this.columns.forEach((el) => el.addEventListener('mouseover', this.onMouseOver));
    this.columns.forEach((el) => el.addEventListener('mouseout', this.onMouseOut));
    this.columns.forEach((el) => el.addEventListener('mousedown', this.onStartDrag));
  }

  renderingItem() {
    /* eslint-disable-next-line */
    for (const column of this.columns) {
      column.innerHTML = '';
    }

    if (this.cards.length) {
      for (let i = 0; i < this.columns.length; i += 1) {
        this.cards[i].forEach((item) => {
          const card = this.toHTML(item);
          this.columns[i].innerHTML += card;
        });
      }
    }
  }

  toHTML(text) {
    this.text = text;
    return `
        <li class="cardmanager-list__item">
          <span class="cardmanager-item__text">${this.text}</span>
          <span class="cardmanager-item__remove"></span>
        </li>
      `;
  }

  addItem(event) {
    const { target } = event;
    const form = target.nextElementSibling;
    target.style.display = 'none';
    form.style.display = 'block';
    form.addEventListener('submit', this.onSubmit);
    const cancelBtn = form.querySelector('.cardmanager-control__cancel');
    cancelBtn.addEventListener('click', this.onFormCancel);
  }

  removeItem(event) {
    const itemText = event.target.closest('.cardmanager-list__item').textContent.trim();
    const currentCol = event.target.closest('.cardmanager__col').querySelector('.cardmanager-col__list');
    const colIndex = this.columns.findIndex((col) => col === currentCol);
    const itemIndex = this.cards[colIndex].findIndex((item) => item === itemText);
    this.cards[colIndex].splice(itemIndex, 1);
    this.renderingItem();
  }

  onMouseOver(event) {
    if (this.draggedElement) return;

    const removeMarkParent = event.target.closest('li.cardmanager-list__item');
    if (!removeMarkParent) return;

    this.removeMark = removeMarkParent.querySelector('.cardmanager-item__remove');
    this.removeMark.style.visibility = 'visible';
    this.removeMark.addEventListener('click', this.removeItem);
  }

  onMouseOut() {
    if (!this.removeMark) return;
    this.removeMark.style.visibility = 'hidden';
  }

  onSubmit(event) {
    event.preventDefault();

    const { target } = event;
    const textarea = target.querySelector('.cardmanager-composer__textarea');
    if (!textarea.value) return;

    const currentCol = target.parentElement.querySelector('.cardmanager-col__list');
    const colIndex = this.columns.findIndex((col) => col === currentCol);
    this.cards[colIndex].push(textarea.value);
    this.renderingItem();

    const addBlock = target.previousElementSibling;
    target.style = 'none';
    addBlock.style.display = 'block';
    textarea.value = '';
  }

  onFormCancel(event) {
    const form = event.target.closest('.cardmanager-col__composer_form');
    form.querySelector('.cardmanager-composer__textarea').value = '';

    this.addBlock = form.previousElementSibling;
    form.style.display = 'none';
    this.addBlock.style.display = 'block';
  }

  collectItems() {
    this.cards = [[], [], []];
    for (let i = 0; i < this.columns.length; i += 1) {
      /* eslint-disable-next-line */
      const cardElements = this.columns[i].querySelectorAll('.cardmanager-list__item');
      /* eslint-disable-next-line */
      for (const card of cardElements) {
        this.cards[i].push(card.textContent.trim());
      }
    }
  }

  fromLocalStorage() {
    if (localStorage.cards) this.cards = JSON.parse(localStorage.getItem('cards'));
    this.renderingItem();
  }

  toLocalSrorage() {
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }
}
