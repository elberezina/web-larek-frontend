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
- src/styles/styles.scss — корневой файл стилей
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

## Описание проекта

### Типы данных

```TypeScript
// Интерфейс осписывающий поля карточки товара
export interface IProduct {
	// Идентификатор товара в магазине
	id: string;

	// URL адрес картинки товара
	image: string;

	// Название товара
	title: string;

	// Категория товара
	category: string;

	// Цена товара
	price: number;

	// Описание товара
	description: string;
}

// Интерфейс описывающий страницу
export interface IPage {
	// Счетчик товаров в корзине
	counter: number;

	// Массив карточек с товарами
	catalog: HTMLElement[];

	// Блокировка прокрутки страницы
	locked: boolean;
}

// Интерфей описываюзий состояние приложения
export interface IAppState {
	// Каталог товаров
	catalog: IProduct[];

	// Корзина
	basket: IProduct[];

	// Заказ
	order: IOrder | null;

    // Устанавливаем каталог товаров
    setCatalog(items: IProduct[]): void;

    // Добавляем товар в корзину
    addToBasket(product: IProduct): void;

    // Удаляем товар из корзины
    removeFromBasket(product: IProduct): void;
}

// Интерфейс описывающий информацию о заказе
export interface IOrder {
	// Массив идентификаторов купленных товаров
	items: string[];

	// Способ оплаты
	payment: string;

	// Сумма заказа
	total: number;

	// Адрес доставки
	address: string;

	// Email
	email: string;

	// Номер телефона
	phone: string;
}

// Интерфейс описывающий ответ успешной покупки
export interface IOrderResult {
	// Идентификатор заказа
	id: string;

	// Сумма заказа
	total: number;
}

// Интерфейс описывающий содержимое модельного окна
export interface IModal {
	content: HTMLElement;
}

// Интерфейс описывающий корзину товаров
export interface IBasket {
	// Массив строк с товарами
	list: HTMLElement[];

	// Общая цена товаров
	total: number;
}

// Интерфейс описывает товар в списке корзины
export interface IProductInBasket extends IProduct {
	// Порядковый номер в корзине
	index: number;
}

// Интерфейс описывает окно ввода контактных данных
export interface IContactsForm {
	// Телефон
	phone: string;

	// Email
	email: string;
}

// Интерфейс описывающий форму оплаты
export interface IPaymentForm {
	// Адрес
	address: string;

	// Способ оплаты
	payment: string;
}

```

### Модели данных

```TypeScript
/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }
}

// Класс хранит состояние приложения
export class AppState extends Model<IAppState> {

	basket: Product[] = [];
	catalog: Product[] = [];
	order: IOrder = null;

	setCatalog(items: IProduct[]) {}
    addToBasket(product: Product) {}
    removeFromBasket(product: Product) {}
}
```

### Классы представления
```TypeScript

// Абстрактный класс компонента от которого все наследуются
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Инструментарий для работы с DOM в дочерних компонентах

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {}

	// Скрыть
	protected setHidden(element: HTMLElement) {}

	// Показать
	protected setVisible(element: HTMLElement) {}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {}
}

// Класс для описания страницы сайта
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {}
	set counter(value: number) {}
	set catalog(items: HTMLElement[]) {}
	set locked(value: boolean) {}
}

// Класс описывает компоненту карточки товара
export class Card extends Component<IProduct> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button?: HTMLButtonElement;

	categoryMapping: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		'хард-скил': 'card__category_hard',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {}

	set id(value: string) {}
	get id(): string {}
	set image(value: string) {}
	set title(value: string) {}
	get title(): string {}
	set category(value: string) {}
	set price(value: number) {}
	get price(): number {}
	set description(value: string) {}
	set button(value: string) {}
}

// Класс описывает карточку товара в модальном окне
export class CardItemPreview extends Card {
	protected _description: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {}
	set description(value: string) {}
}

// Класс описывает карточку корзины
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {}

	set total(price: number) {}
	set list(items: HTMLElement[]) {}
}

// Класс описывает форму ввода контактных данных
export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {}
}

// Класс описывает форму оплаты товара
export class PaymentForm extends Form<IPaymentForm> {
	protected _card: HTMLButtonElement;
	protected _onReceipt: HTMLButtonElement;
	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {}
}
```

### Взаимодействие 

```TypeScript
// Реализует паттерн «Наблюдатель» и позволяет подписываться на события и 
// уведомлять подписчиков о наступлении события. Имеет конструктор который инициализирует события
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;
    constructor() {}

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {}

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {}

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {}

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {}

    /**
     * Сбросить все обработчики
     */
    offAll() {}

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {}
}

// Это базовый класс,  который отвечает за работу с сервером. Конструктор класса принимает 
// базовый Url для доступа к серверу и опции для доступа к различным параметрам. 
export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {}

    // Обработчик ответа от сервера
	protected handleResponse(response: Response): Promise<object> {}

    // Используется для получения данных с сервера
	get(uri: string) {}

    // Используется для отправки данных на сервер
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {}
}

// Класс наследуется от базового класса Api, позволяет получить список карточек с 
// сервера и необходимую информацию по каждой карточке для дальнейшего использования 
// в галлереи и в оформлении заказа
export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {}

    // Получить продукт по ID
	getProductById(id: string): Promise<IProduct> {}

    // Получить список продуктов
	getProductList(): Promise<IProduct[]> {}
}
```