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
