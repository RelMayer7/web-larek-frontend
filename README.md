# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице.
- слой данных, отвечает за хранение и изменение данных.
- презентер, отвечает за связь представления и данных.

## Данные и типы данных, используемые в приложении

Карточка

```
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Пользователь
``` 
export interface IUser {
  payment: string;
  email: string;
  phone: string;
  address: string;
} 
```

Заказ

``` 
export interface IOrder extends IUser {
  items: string[];
  total: number;
}
```

Данные для формы ошибок.
``` 
export type FormErrors = Partial<Record<keyof IOrder, string>>;
``` 

Данные по способу оплаты и адресу, используемые в форме оплаты.
``` 
export type IPaymentInfo = Pick<IUser, 'payment' | 'address'> 
```

Данные пользователя, используемые в форме контактов.
```
export type IContactInfo = Pick<IUser, 'phone' | 'email'>
```

## Базовый код

### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опционально объект с заголовками запросов.
- constructor(baseUrl: string, options: RequestInit = {})

Поля класса:
- baseUrl: string - адрес сервера.
- options: RequestInit - объект с настройками запроса.

Методы:
- get(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными,  которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. по умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- handleResponse(response: Response): Promise<object> - принимает ответ сервера и проверяет его на ошибки. Возвращает ответ если статус `ok`, в противном случае возвращает ошибку.

### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на событие, происходящее в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Поля класса:
- _events: Map<EventName, Set<Subscriber>> - хранит подписчитков и события.

Основыне методы, реализуемые классом описаны интерфейсом 'IEvents':
- on<T extends object>(eventName: EventName, callback: (event: T) => void) - подписка на событие.
- off(eventName: EventName, callback: Subscriber) - снятие обработчкиа с события.
- emit<T extends object>(eventName: string, data?: T)  - инициализация события с данными.
- onAll(callback: (event: EmitterEvent) => void) - подписка на все события.
- offAll() - снятие всех собработчиков.
- trigger<T extends object>(eventName: string, context?: Partial<T>) - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Класс Component
Абстракный класс, иcпользующийся для работы с DOM во всех классах представления.
Конструктор принимает элемент представления.
- protected constructor(protected readonly container: HTMLElement)

Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс элемента.
- protected setText(element: HTMLElement, value: unknown) - устанавливает еект элемента.
- setDisabled(element: HTMLElement, state: boolean) - меняет статус блокировки элемента.
- protected setHidden(element: HTMLElement) - скрывает элемент.
- protected setVisible(element: HTMLElement) - показвыает элемент.
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение и альтернативный текст.
- render(data?: Partial<T>): HTMLElement - возвращает элемент.

## Слой данных

### Класс LarekModel

Класс отвечает за хранение и логику работы с данными карточек товаров и корзины с товарами. Конструктор принимает инстанс брокера событий\
В полях класса хранятся следкющие данные:
- _items: ICard[] - массив объектов карточек.
- _basket: string[] - массив id товаров в корзине.
- _preview: string | null - id карточки выбранной для просмотра в модальном окне.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- order: IOrder - объект данных по заказу.

Также класс представляет набор методов для взаимодействия с этими данными.
- getItem(id: string): ICard - возвращает объект карточки по id.
- addItemToBasket(id: string): void - добавляет id выбранного продукта в массив корзины.
- removeItemFromBasket(id: string): void - удалаяет id карточки из массива корзины.
- getTotalSum(): number - возвращает текущую сумму товаров в корзине.
- clearBasket(): void - очищает корзину.
- chekBasket(id: string): boolean - проверяет был ли добален товар в корзину ранее.
- clearPreview() - очищает поле с выбранной карточкой.
- clearOrder() - очищает объект заказа.
- setOrderField(field: keyof IPaymentInfo, value: string) - устанаваливает занчение из формы заказа.
- setContactsField(field: keyof IContactInfo, value: string) - устанавливает значение из формы контактной информации.
- validateOrder() - валидирует форму заказа.
- validateContacts() - валидирует форму контактной информации.
- setOrderItems() - устанваливает id товаров из корзины в заказ. Если товар бесценен(NULL) исключается из закзаа.
- setOrderTotal() - устанавливает итоговую сумму в объект заказа.
- а также сеттеры и геттеры для сохранения и получения данных из полей класса.

## Классы представления
Все классы представления отвечают за отображение внутри контейнеров (DOM-элемент) передаваемых в них данных. Расширяют класс Component.

### Класс Modal
Класс отвечает за реализацию модального окна. Также предоставляет методы 'open' и 'close' для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.\
Конструктор принимает элемент модального окна в котором будет отбражатся содержимое а также экземпляр класса `EventEmitter`.
- constructor(container: HTMLElement, events: Ievents).

Поля класса:
- _content: HTMLElement - контейнер для отображения получаемого содержимого.
- _closeButton: HTMLButtonElement - кнопка закрытия модального окна.
- events: IEvent = брокер событий.

Методы: 
- set content(value: HTMLElement) - сеттер устанавливающий форму/карточку в контейнер модального окна.
- open(): void - метод для открытия модального окна
- close(): void - метод для закртытия модального окна.
- render(data: IModal): HTMLElement - метод возвращает разметку модального окна.

### Класс Form
Отвечает за реализацию формы.
Конструктор принимает элемент формы а также экземпляр класса `EventEmitter`.
- constructor(protected container: HTMLFormElement, protected events: IEvents).

Поля класса: 
- _submitButton: HTMLButtonElement - кнопка подверждения.
- _errors: HTMLElement - поле вывода ошибки.

Методы:
- onInputChange(field: keyof T, value: string) - создает событие изменения формы, с объектом поля и значения.
- set valid(value: boolean) - блокирует/разблокирует кнопку отправки формы.
- set errors(value: string) - устанавливет ошибки валидации.
- render(state: Partial<T> & IForm) - возвращает разметку формы.

### Класс OrderForm 
Отвечает за реализацию формы оплаты, расширяет класс Form.
Конструктор принимает элемент формы а также экземпляр класса `EventEmitter`.
- constructor(container: HTMLElement, events: Ievents).

Поля класса: 
- buttonCard - кнопка оплаты картой.
- buttonCash - кнопка оплаты при получении.
- buttons: HTMLButtonElement[] - массив кнопок.

Методы:
- set address(value: string) - устанавливает адреса.
- toggleButton(name: string) - переключает активность кнопок, активна выбранная кнопка способа оплаты.

### Класс ContactsForm
Отвечает за реализацию формы с контактной информацией, расширяет класс Form.
Конструктор принимает элемент формы а также экземпляр класса `EventEmitter`.
- constructor(container: HTMLElement, events: Ievents).

Методы:
- set email(value: string) - устанавливает значение адреса.
- set phone(value: string) - устанавливает значение телефона.

### Класс CardGeneral
Класс родитель для всех карточек. Реализует методы заполнения для общих полей всех вариантов карточки в представлениях. А также реализует события при клике на кнопку или при клике на контейнер с карточкой. Конструктор принимает DOM элемент темплейта карточки, а также событие происходящее при клике на карточку или на кнопку в крточке.
- constructor(container: HTMLElement, actions?: ICardAction)

Поля класса:
- _title: HTMLElement - название карточки товара.
- _price: HTMLElement - цена товара.

Методы:
- set title(value: string) - устанавливает название.
- get title() - возвращает название.
- set price(value: number | null) - устанавливает цену, если приходит null то бесценно.

### Класс Card

Отвечает за отображение карточки на странице. расширяет класс CardGeneral. В конструктор класса передается DOM элемент темплейта карточки а также событие происходящее при клике на карточку или на кнопку в крточке. Устанавливает слушатель на открытие модального окна при клике на карточку.
- constructor(container: HTMLElement, actions?: ICardAction).

Поля класса:
- _category: HTMLElement - категория продукта.
- _image: HTMLImageElement - картинка продукта.
- _id: string - id выбранной карточки.

Методы:
- set category(value: string) - устанваливает категорию товара и класс категории.
- defineCategory(key: string) - принимает наименование категории, возвращает класс категории.
- set image(value: string) - устанавливает изображение.

### Класс СardPreview

Отвечает за отображение карточки в модельном окне, расширяет класс Card.
Конструктор принимает элемент карточки, а также событие происходящее при клике.
- constructor(container: HTMLElement, actions?: ICardAction).

Поля класса:
- _description: HTMLElement - описание продукта

Методы:
- set description(value: string) - устанавливает описание продукта.
- setButtonStatus(value: boolean) - блокирует кнопку карточки.

### Класс CardBasket 

Отвечает за отображение карточки товара в корзине, расширяет класс CardGeneral.
Конструктор принимает элемент карточки, а также событие происходящее при клике..
- constructor(container: HTMLElement, actions?: ICardAction).

Поля:
- _itemIndex: HTMLElement; - порядковый номер товара в корзине.
- cardButton: HTMLButtonElement - кнопка удаления карточки.

Методы:
- set itemIndex(value: number) - устанавливает номер карточки в корзине.

### Класс Basket

Отвечает за отображение корзины.\
Конструктор принимает элемент корзины, а также экземпляр класса `EventEmitter`.
- constructor(container: HTMLElement, protected events: IEvents).

Поля класса:
- _list: HTMLElement - контейнер для списка товаров корзины.
- _total: HTMLElement - контейнер общей суммы корзины.
- submitButton: HTMLButtonElement - кнопка подтверждения.

Методы:
- set items(items: HTMLElement[]) - устанавливает товары в корзину.
- set total(total: number) - устанавливает общую стоимость товаров.

### Класс Sucess 

Отвечает за отображение элемента оповещающего об успешном оформлении заказа.
Конструктор принимает DOM элемент темплейта оповещения, а также собите.
constructor(protected container: HTMLFormElement, actions: ISuccessActions) 

Поля класса:
- _close: HTMLButtonElement - кнопка закрытия окна.
- _total: HTMLElement - списанная сумма.

Методы:
- set total(value: number) - устанавливает общую сумму заказа.

### Класс Page
Отвечает за отображение блока с карточками на главной странице а также кнопки корзины и счетчика товаров в корзине. Конструктор принимает элемент страницы а также экземпляр класса `EventEmitter`.
- constructor(page: HTMLElement, events: Ievents).

Поля класса:
- _wrapper: HTMLElement - контейнер сраницы.
- _gallery - контейнер для размещения карточек.
- _basketСounter - контейнер для отображения колличества товара в корзине.
- _basketButton - кнопка корзины.

Методы:
- set gallery(items: HTMLElement[]) - устанавливает карточки в каталог.
- set counter(value:number) - устанавливает значение счетчика товаров в корзине.
- set locked(value: boolean) - блокирует прокрутку страницы.

## Слой коммуникации

### Класс LarekApi
Расширяет класс Api. Реализует методы загрузки массива карточек и отправки заказа на сервер. Конструктор принимает CDN_URL, API_URL и параметры запроса.
API_URL - используется для запросов данных о товарах и отправки заказа.
CDN_URL - используется для формирования адреса картинки в товаре.

- constructor(api: string, cdn: string, options: RequestInit)

Методы:
- getCardList: () => Promise<ICard[]> - метод загрузки данных продуктов.
- orderData: (order: IOrder) => Promise<IOrderResult> - метод отправки заказа.
- getCard: (id: string) => Promise<ICard> - метод загрузки по одному продукту.

## Взаимодействие компонентов
Код, описывабщий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
взаимодействие осуществляется за счет собыйтий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначлаа создаются экземпляры всех необходимых классов, а затем настраиваются обработчики собыйтий.

*Список всех собыйтий, которые могут генерироваться в системе.*\
*События изменения данных(генерируются классом модели данных)*
- `cards:changed` - изменение массива карточек.
- `card:selected` - изменение открываемой в модальном окне карточки.
- `basket:changed` - изменение массива корзины.
- `order:ready` - форма с информацией деталей по заказу прошла валидацию.
- `contacts:ready` - форма с контактной информацией прошла валидацию.
- `formErrors:change` - изменение в форме.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображенияв модальном окне.
- `modal:open` - открытие модального окна.
- `modal:close` - закрытие модального окна.
- `card:send` - карточка отправлена в корзину.
- `basket:card-delete` - карточка удалена из корзины.
- `order:open` - открытие формы оплаты.
- `order:submit` - отправлена формы оплаты.
- `contacts:submit` - отправлена форма с контактной ифнормацией.
- `success` - закрытие формы с оповещением об успешном оформлении заказа.