import { ILarekModel, ICard } from "../types";
import { IEvents } from "./base/events";

class LarekData implements ILarekModel {
  protected _items: ICard[];
  protected _basket: string[];
  protected _preview: string | null;

  constructor(protected events: IEvents) {
    this._items = [];
    this._basket = [];
    this.events = events;
  }

  getItem(id: string): ICard {
    return this._items.find(item => item.id === id);
  }

  addItemToBasket(id: string): void {
    this._basket.push(id);
  }

  removeItemFromBasket(id: string): void {
    this._basket = this._basket.filter(item => item !== id)
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
  }

  set items(items: ICard[]) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  get basket() {
    return this._basket;
  }

  set preview(id) {
    this._preview = id;
  }

  get preview() {
    return this._preview;
  }
}