import {Component} from '../base/component';
import {ensureElement} from '../../utils/utils';
import {ICard} from '../../types/index';
import {isEmpty} from '../../utils/utils';

interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

class CardGeneral extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected cardButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, actions: ICardAction){
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this.cardButton = container.querySelector('.card__button');

    if(actions.onClick){
      if (this.cardButton) {
        this.cardButton.addEventListener('click', actions.onClick);
      } else container.addEventListener('click', actions.onClick);
    }

  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title() {
    return this._title.textContent;
  }

  set price(value: number | null) {
    if (isEmpty(value)){
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }
}

export class Card extends CardGeneral {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _id: string;
  
  constructor(container: HTMLElement, actions: ICardAction) {
    super(container, actions);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container); 
  }

  defineCategory(key: string) {
    switch (key) {
      case 'софт-скил':
        return 'card__category_soft'
      case 'хард-скил':
        return 'card__category_hard'
      case 'другое':
        return 'card__category_other'
      case 'дополнительное':
        return 'card__category_additional'
      case 'кнопка':
        return 'card__category_button'
    }
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = 'card__category';
    this.toggleClass(this._category, this.defineCategory(value), true);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

}

export class CardPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions: ICardAction) {
    super(container, actions);
    this._description = ensureElement<HTMLElement>('.card__text', container);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  setButtonStatus(value: boolean): void {
    super.setDisabled(this.cardButton, value);
  }
}

export class cardBasket extends CardGeneral {
  protected _itemIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardAction) {
    super(container, actions);

    this._itemIndex = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set itemIndex(value: number) {
    this.setText(this._itemIndex, value + 1);
  }

}