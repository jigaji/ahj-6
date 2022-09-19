export default class DND {
  onStartDrag(event) {
    if (!event.target.classList.contains('cardmanager-list__item')) return;

    this.target = event.target;
    this.draggedElement = this.target.cloneNode(true);
    this.draggedElement.classList.add('cardmanager__dragged');
    this.draggedElement.querySelector('.cardmanager-item__remove').style.visibility = 'hidden';
    document.body.append(this.draggedElement);

    const { x, y } = this.target.getBoundingClientRect();

    this.draggedX = event.pageX - x;
    this.draggedY = event.pageY - y;
    this.draggedElement.style.width = `${this.target.offsetWidth}px`;
    this.draggedElement.style.height = `${this.target.offsetHeight}px`;
    this.draggedElement.style.left = `${event.pageX - this.draggedX}px`;
    this.draggedElement.style.top = `${event.pageY - this.draggedY}px`;

    this.target.style.display = 'none';

    document.addEventListener('mousemove', this.onDrag);
    this.columns.forEach((col) => col.addEventListener('mousemove', this.takePlace));
    this.columns.forEach((col) => col.addEventListener('mouseleave', this.removePlace));
    document.addEventListener('mouseup', this.onFinishDrag);
  }

  onDrag(event) {
    event.preventDefault();
    if (!this.draggedElement) return;

    this.draggedElement.style.left = `${event.pageX - this.draggedX}px`;
    this.draggedElement.style.top = `${event.pageY - this.draggedY}px`;
  }

  onFinishDrag(event) {
    if (!this.draggedElement) return;
    if (!event.target.closest('.cardmanager-col__list')) {
      this.onStopDrag();
      return;
    }

    this.targetPlace.replaceWith(this.target);
    this.onStopDrag();
    this.collectItems();
  }

  onStopDrag() {
    this.target.style.display = 'block';
    this.draggedElement.remove();
    this.draggedElement = null;
    this.draggedX = null;
    this.draggedY = null;
    this.targetPlace = null;
    document.removeEventListener('mousemove', this.dragMove);
    this.columns.forEach((col) => col.removeEventListener('mousemove', this.takePlace));
    this.columns.forEach((col) => col.removeEventListener('mouseleave', this.removePlace));
    document.removeEventListener('mouseup', this.dragFinish);
  }

  takePlace(event) {
    if (!this.draggedElement) return;

    const column = event.target.closest('.cardmanager-col__list');
    const columnItems = column.querySelectorAll('.cardmanager-list__item');
    const allPos = [column.getBoundingClientRect().top];
    /* eslint-disable-next-line */
    for (const item of columnItems) {
      allPos.push(item.getBoundingClientRect().top + item.offsetHeight / 2);
    }

    if (!this.targetPlace) {
      this.targetPlace = document.createElement('div');
      this.targetPlace.classList.add('cardmanager__new-place');
      this.targetPlace.style.width = `${this.draggedElement.offsetWidth}px`;
      this.targetPlace.style.height = `${this.draggedElement.offsetHeight}px`;
    }

    const itemIndex = allPos.findIndex((item) => item > event.pageY);
    if (itemIndex !== -1) columnItems[itemIndex - 1].before(this.targetPlace);
    else column.append(this.targetPlace);
  }

  removePlace() {
    if (!this.draggedElement) return;

    if (this.targetPlace) {
      this.targetPlace.remove();
      this.targetPlace = null;
    }
  }
}
