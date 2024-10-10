import { ILarekModel, ICard, IOrder, FormErrors, IPaymentInfo, IContactInfo, eventList} from "../types";
import { IEvents } from "./base/events";

export class LarekModel implements ILarekModel {
  protected _items: ICard[];
  protected _basket: string[];
  protected _preview: string | null;
  protected _order: IOrder;
  protected formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this._items = [];
    this._basket = [];
    this.events = events;
    this._order = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    }
    
  }

  getItem(id: string): ICard {
    return this._items.find(item => item.id === id);
  }

  addItemToBasket(id: string): void {
    if (this.chekBasket(id)) {
      console.log('товар уже добавлен');
    } else {
      this._basket.push(id);
      this.events.emit(eventList.basketChanged);
    };
  }

  removeItemFromBasket(id: string): void {
    this._basket = this._basket.filter(item => item !== id);
    this.events.emit(eventList.basketChanged);
  }

  getTotalSum(): number {
    let total: number = 0;
    this._basket.forEach(basketItem => {
      total += this._items.find(item => item.id === basketItem).price
    })
    return total;
  }

  clearBasket(): void {
    this._basket = [];
    this.events.emit(eventList.basketChanged);
  }

  chekBasket(id: string): boolean {
    return this._basket.includes(id);
  }

  clearPreview() {
    this._preview = null;
  }

  clearOrder() {
    this._order = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    }
  }

  setOrderField(field: keyof IPaymentInfo, value: string) {
    this._order[field] = value;

    if (this.validateOrder()) {
      this.events.emit(eventList.orderReady, this._order);
    }
  }

  setContactsField(field: keyof IContactInfo, value: string) {
    this._order[field] = value;
    
    if (this.validateContacts()) {
      this.events.emit(eventList.contactsReady, this._order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this._order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this._order.payment) {
      errors.address = 'Необходимо выбрать способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit(eventList.formErrorsChange, this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this._order.email) {
      errors.email = 'Необходимо указать адрес электронной почты';
    }
    if (!this._order.phone) {
      errors.phone = 'Необходимо указать номер телефона';
    }

    this.formErrors = errors;
    this.events.emit(eventList.formErrorsChange, this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setOrderItems() {
    this.basket.forEach(basketItem => {
      this.order.items.push(basketItem);
    })
  }

  setOrderTotal() {
    this._order.total = this.getTotalSum();
  }

  set items(items: ICard[]) {
    this._items = items;
    this.events.emit(eventList.cardsChanged);
  }

  get items() {
    return this._items;
  }

  get basket() {
    return this._basket;
  }

  set preview(id: string) {
    this._preview = id;
    this.events.emit(eventList.cardSelected, this.getItem(id));
  }

  get order () {
    return this._order;
  }

  get preview() {
    return this._preview;
  }
}