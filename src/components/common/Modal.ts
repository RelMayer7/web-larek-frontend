import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement} from '../../utils/utils';
import {eventList} from '../../types/index'

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.toggleModal(true);
    this.events.emit(eventList.modalOpen);
  }

  close() {
    this.toggleModal(false);
    this.content = null;
    this.events.emit(eventList.modalClose);
  }

  toggleModal(state: boolean) {
    this.toggleClass(this.container, 'modal_active', state);
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}