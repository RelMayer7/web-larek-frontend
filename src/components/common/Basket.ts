import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement, createElement} from '../../utils/utils';
import {eventList} from '../../types/index'

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
      events.emit(eventList.orderOpen);
    })

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.toggleButton(false);
    } else {
      this.toggleButton(true);
      this._list.replaceChildren(createElement<HTMLElement>('div'));
    }
  }

  toggleButton(state: boolean) {
    this.setDisabled(this.submitButton, state);
  } 

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`)
  }

}
