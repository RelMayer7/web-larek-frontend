import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement} from '../../utils/utils';
import {eventList} from '../../types/index'

interface IPage {
  basketCounter: HTMLElement;
  gallery: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _wrapper: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  
  constructor(page: HTMLElement, protected event: IEvents) {
    super(page);

    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._gallery = ensureElement<HTMLElement>('.gallery');
    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');

    this._basketButton.addEventListener('click', () => {
      this.event.emit(eventList.basketOpen);
    })
  }

  set counter(value:number) {
    this.setText(this._basketCounter, String(value));
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
  }

}