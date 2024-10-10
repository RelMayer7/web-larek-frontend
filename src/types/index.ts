export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IUser {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IUser {
  items: string[];
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type IPaymentInfo = Pick<IUser, 'payment' | 'address'>

export type IContactInfo = Pick<IUser, 'phone' | 'email'>

export interface ILarekModel {
  items: ICard[];
  preview: string | null;
  basket: string[];
  getItem(id: string): ICard;
  addItemToBasket(id: string): void;
  removeItemFromBasket(id: string): void;
  getTotalSum(): number;
  clearBasket(): void;
}

export enum eventList {
  cardsChanged = 'cards:changed',
  cardSelect = 'card:select',
  cardSelected = 'card:selected',
  cardSend = 'card:send',
  basketCardDelete = 'basket:card-delete',
  basketOpen = 'basket:open',
  basketChanged = 'basket:changed',
  orderOpen = 'order:open',
  formErrorsChange = 'formErrors:change',
  orderSubmit = 'order:submit',
  contactsSubmit = 'contacts:submit',
  success = 'success',
  modalOpen = 'modal:open',
  modalClose = 'modal:close',
  orderReady = 'order:ready',
  contactsReady = 'contacts:ready',
}