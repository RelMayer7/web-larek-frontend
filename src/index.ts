import './scss/styles.scss';
import { API_URL, CDN_URL} from './utils/constants';
import {cloneTemplate, ensureElement} from "./utils/utils";
import {EventEmitter} from './components/base/events';
import {LarekModel} from './components/LarekModel';
import {LarekApi} from './components/LarekApi';
import {Page} from './components/common/Page';
import {Card, CardPreview, cardBasket} from './components/common/Card';
import {Modal} from './components/common/Modal';
import {ICard, IOrder, IPaymentInfo, IContactInfo, eventList} from './types';
import {Basket} from './components/common/Basket';
import {OrderForm, ContactsForm} from './components/common/Form';
import {Success} from './components/common/Success';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);

//Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//Модель данных приложения
const larekModel = new LarekModel(events);

//глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Загружаем данные с сервера в модель
api.getCardList()
  .then(data => larekModel.items = data)
  .catch(console.error);

//Загружаем карточки
events.on(eventList.cardsChanged, () => {
  page.gallery = larekModel.items.map(item => {
    const card =  new Card(
      cloneTemplate(cardCatalogTemplate), 
      {onClick: () => events.emit(eventList.cardSelect, item)}
    )
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      id: item.id,
   });
  });

  page.counter = larekModel.basket.length;
});


//Клик по карточке
events.on(eventList.cardSelect, (item: ICard) => {
  larekModel.preview = item.id;
})

//Открытие модального окна с карточкой
events.on(eventList.cardSelected, (item: ICard) => {
  const cardPreview = new CardPreview(
    cloneTemplate(cardPreviewTemplate),
    {onClick: () => events.emit(eventList.cardSend, item)}
  );
  modal.render({
    content: cardPreview.render({
      description: item.description,
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      id: item.id,
    })
  })
  cardPreview.setButtonStatus(larekModel.chekBasket(item.id) || larekModel.getItem(item.id).price === null);
})

//Добавление товара в корзину.
events.on(eventList.cardSend, (item: {id: string}) => {
  larekModel.addItemToBasket(item.id);
  larekModel.clearPreview();
  page.counter = larekModel.basket.length;
  modal.close();
})

const basket = new Basket(cloneTemplate(basketTemplate), events);

//Если корзина изменилась, рендерим ее
events.on(eventList.basketChanged, () => {
  basket.items = larekModel.basket.map(id => {
    const card = new cardBasket(
      cloneTemplate(cardBasketTemplate),
      {onClick: () => events.emit(eventList.basketCardDelete, {id})}
    )
    card.itemIndex = larekModel.basket.indexOf(id);
    return card.render({
      title: larekModel.getItem(id).title,
      price: larekModel.getItem(id).price,
    })
  })
  basket.total = larekModel.getTotalSum();
  page.counter = larekModel.basket.length;
})

//Открытие модального окна с корзиной
events.on(eventList.basketOpen, () => {
  modal.render({ content: 
    basket.render()})
})

//если удаляем товар из корзины, рендерим модалку
events.on(eventList.basketCardDelete, (item: {id: string}) => {
  larekModel.removeItemFromBasket(item.id);
  modal.render({ content: 
    basket.render()}
  )
})

const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

//Открыть форму оплаты
events.on(eventList.orderOpen, () => {
  order.battonDisabled();
  modal.render({
    content: order.render({
      address: '',
      payment: '',
      valid: false,
      errors: []
    })
  })
})

//Ошибки формы
events.on(eventList.formErrorsChange, (errors: Partial<IOrder>) => {
  const{address, payment, email, phone} = errors;
  order.valid = !address && !payment;
  contacts.valid = !email && !phone;
  order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
})

//Изменилось поле оплаты
events.on(/^order..*:change/, (data: {field: keyof IPaymentInfo, value: string}) => {
  larekModel.setOrderField(data.field, data.value);
})

//Открыть форму контактной информации
events.on(eventList.orderSubmit, () => {
  modal.render({
    content: contacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: []
    })
  })
})

//Изменилась форма контактной информации
events.on(/^contacts..*:change/, (data: {field: keyof IContactInfo, value: string}) => {
  larekModel.setContactsField(data.field, data.value);
})

//Отправляем заказ на сервер
events.on(eventList.contactsSubmit, () => {
  larekModel.setOrderItems();
  larekModel.setOrderTotal();
  api.orderData(larekModel.order)
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          larekModel.clearBasket();
          events.emit('success');
        }
      });
      success.total = larekModel.getTotalSum();
      modal.render({
        content: success.render({})
      })
      larekModel.clearBasket();
      larekModel.clearOrder();
    })
    .catch(console.error);
})

//Очищаем корзину и заказ модели
events.on(eventList.success, () => {
  larekModel.clearBasket()
  larekModel.clearOrder();
})

//блокируем прокрутку страницы
events.on(eventList.modalOpen, () => {
  page.locked = true;

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
      modal.close();
    }
  })

})

//Разблокируем прокурутку страницы
events.on(eventList.modalClose, () => {
  page.locked = false;
})
