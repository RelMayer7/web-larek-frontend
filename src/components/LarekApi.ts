import {Api, ApiListResponse} from './base/api';
import { ICard, IOrder} from '../types';

export interface IOrderResult {
  id: string;
  total: number;
}

interface ILarekApi {
  getCardList(): Promise<ICard[]>;
  orderData: (order: IOrder) => Promise<IOrderResult>;
  getCard: (id: string) => Promise<ICard>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(api: string, cdn: string, options?:RequestInit) {
    super(api, options);
    this.cdn = cdn;
  }

  getCard(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then((item: ICard) => ({
      ...item,
      image: this.cdn + item.image,
    }))
  }

  getCardList(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  };

  orderData(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }

}