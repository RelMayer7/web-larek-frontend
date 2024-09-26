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




