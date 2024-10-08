import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement, createElement} from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents){
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container)
    this.submitButton = container.querySelector('.basket__button');
    
    this.submitButton.addEventListener('click', () => {
      events.emit('order:open');
    })

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.setDisabled(this.submitButton, false);
    } else {
      this.setDisabled(this.submitButton, true);
      this._list.replaceChildren(createElement<HTMLElement>('div'));
    }
  }

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`)
  }

}
