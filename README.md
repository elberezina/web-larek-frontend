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

## Об архитектуре

Взаимодействия внутри приложения происходят через события. Модели инициируют события, а в основном коде их слушателями выполняются передача данных компонентам отображения и вычисления. Кроме того, изменяется состояние моделей.


## Основные типы данных

### interface IAppState 
Интерфейс описывающий состояние приложения
- `catalog: IProduct[]` - каталог товаров
- `basket: IProduct[]` - корзина
- `order: IOrder | null` - заказ
- `setCatalog(items: IProduct[]): void` - устанавливаем каталог товаров
- `addToBasket(product: IProduct): void` - добавляем товар в корзину
- `removeFromBasket(product: IProduct): void` - удаляем товар из корзины
- `getTotalBasketPrice(): number` - метод возвращает общую стоимость товаров в корзине

### interface IModal
интерфейс описывающий содержимое модельного окна
- `content: HTMLElement` - DOM-элемент модального окна

### interface IProduct
интерфейс описывающий поля карточки товара
- `id: string` - идентификатор товара в магазине
- `image: string` - URL адрес картинки товара
- `title: string` - название товара
- `category: string` - категория товара
- `price: number | null` - цена товара
- `description: string` - описание товара
- `selected: boolean` - продукт выбран

### interface IPage
интерфейс описывающий страницу
- `counter: number` - счетчик товаров в корзине
- `catalog: HTMLElement[]` - массив карточек с товарами
- `locked: boolean `- блокировка прокрутки страницы

### interface IBasket
интерфейс описывающий корзину товаров
- `list: HTMLElement[]` - массив строк с товарами
- `total: number` - общая стоимость товаров

### interface IProductInBasket extends IProduct
Интерфейс описывает товар в списке корзины
- `index: number` - порядковый номер в корзине

### interface IOrder
интерфейс описывающий информацию о заказе
- `items: string[]` - массив идентификаторов купленных товаров
- `payment: string` - способ оплаты
- `total: number` - сумма заказа
- `address: string` - адрес доставки
- `email: string` - Email
- `phone: string` - номер телефона

### interface IContactsForm
Интерфейс описывает окно ввода контактных данных
- `phone: string` - телефон
- `email: string` - Email

### interface IOrderForm
Интерфейс описывающий форму оплаты
- `address: string` - адрес
- `payment: string` - способ оплаты

### interface IOrderResult
Интерфейс описывающий ответ успешной покупки
- `id: string` - идентификатор заказа
- `total: number` - сумма заказа

### interface IOrderValidate 
Интерфейс используется для валидации полей при заполнении модели заказа
- `phone: string;`- телефон
- `email: string;` - Email
- `address: string;` - адрес
- `payment: string;` - способ оплаты

### interface ISuccessForm 
Интерфейс описывает форму успешного заказа
- `description: number;` - сумма списанных средств


## Базовый код

### class Api
Это базовый класс,  который отвечает за работу с сервером. 

Конструктор класса:
- `baseUrl: string` - принимает базовый Url для доступа к серверу
- `options: RequestInit` - опции для доступа к различным параметрам

Методы класса:
- `get(uri: string)` - для получения данных с сервера
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - для отправки данных на сервер
- `handleResponse(response: Response): Promise<object>` - обрабатывает ответ от сервера

### class LarekAPI 
Класс наследуется от базового класса Api, позволяет получить список карточек с сервера и необходимую информацию по каждой карточке для дальнейшего использования в галлерее и в оформлении заказа. 
Методы класса:
- `getProductById` - получить продукт по ID
- `getProductList` - получить список продуктов
- `createOrder` - создание заказа

### class EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Имеет конструктор который инициализирует события.
Методы класса:
- `on`  - установить обработчик на событие
- `off` - снять обработчик с события
- `emit` - инициировать событие с данными
- `onAll` - слушать все события
- `offAll` - сбросить все обработчики
- `trigger` - создает коллбек триггер, генерирующий событие при вызов

### abstract class Component`<T>`
Это базовый абстрактный класс,  который является основой для компонентов проекта. 
Конструктор класса:
- `constructor(protected readonly container: HTMLElement)` - принимает DOM элемент для работы в дочерних компонентах

Методы класса:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - используем для переключения класса компонента
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean)` - определяет нужна блокировка или нет
- `setHidden(element: HTMLElement)` - скрывает элемент
- `setVisible(element: HTMLElement)` - показывает элемент удаляя свойство display = 'none'
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом. 
- `render(data?: Partial<T>): HTMLElement` - возвращает корневой DOM-элемент.

### abstract class Model`<T>`
Абстрактный базовый класс, предназначенный для создания модельных данных. Модели используются для представления и управления данными в приложении.
Конструктор класса:
- `constructor(data: Partial<T>, protected events: IEvents)` - принимает данные и событие
Метод класса:
- `emitChanges` - сообщает всем что модель поменялась

## Компоненты модели данных

### class Product extends Model`<IProduct>`
Класс наследуется от базового класса Model и расширяется интерфейсом IProduct.  Данный класс хранит информацию о товаре.
Поля класса:
- `id: string;` - идентификатор товара в магазине
- `description: string;` - описание товара
- `image: string;` - URL адрес картинки товара
- `title: string;` - название товара
- `category: string;` - категория товара
- `status: boolean;` - статус товара, в корзине или нет
- `price: number;` - цена товара

### class AppState 
Класс наследуется от базового класса Model и расширяется интерфейсом IAppState.  Данный класс хранит состояние приложения.
Поля класса:
- `basket: Product[]` - список товаров в корзине
- `catalog: Product[]` - каталог товаров
- `order: IOrder` - заказ
- `formErrors: FormErrors` - ошибки при заполнении полей форм

Методы класса:
- `setCatalog` - устанавливает каталог продуктов
- `addToBasket` - добавляет продукт в корзину 
- `removeFromBasket` - удаляет продукт из корзины
- `getTotalBasketPrice` - считает итоговую стоимость товаров в корзине
- `getEmptyOrder` - устанавливает пустые поля в формах оформления заказа
- `getCountProductInBasket` - считает количество товаров в корзине
- `setOrderFields` - устанвливает значения в форму заказа
- `validateOrder` - проверяет внесены ли данные в поля формы с оплатой
- `validateContacts` - проверяет внесены ли данные в поля формы с контактами
- `addProductsToOrder` - добавить все товары из корзины в заказ
- `clearBasket` - очистить корзину
- `resetSelected` - удаляет информацию о том, что товар в корзине. Товар снова можно купить
- `clearOrder` - очистить поля заказа


## Компоненты представления
### class Page 
Класс для отображения главной страницы. Наследуется от базового класса Component и расширяется интерфейсом IPage. 
Класс отображает каталог товаров на главной странице, отображает количество товаров на иконке корзины. При открытии модального окна, страница блокируется. 
Поля класса:
- `counter: HTMLElement` - DOM элемент счетчика товаров в корзине
- `catalog: HTMLElement` - DOM элемент каталога товаров
- `wrapper: HTMLElement` - DOM элемент главной страницы
- `basket: HTMLElement` - DOM элемент значка корзины

Конструктор класса: 
- `container: HTMLElement` - DOM элемент всей страницы
- `events: IEvents` - ссылка на менеджер событий

Методы класса:
- `set counter(value: number)` - устанавливает счетчик на иконке корзины
- `set catalog(items: HTMLElement[])` - устанавливает каталог товаров
- `set locked(value: boolean)` - при открытие модального окна страница блокируется

### class Card
Класс описывает компоненту карточки товара, наследуется от базового класса Component и расширяется интерфейсом IProduct. Данные класс служит для отображения карточки и информации по ней в галлереи товаров, просмотре карточки товара и корзине. 
Поля класса:
- `image: HTMLImageElement` - DOM элемент изображения продукта
- `title: HTMLElement` - DOM элемент названия продукта
- `category: HTMLElement` - DOM элемент категории продукта
- `price: HTMLElement` - DOM элемент цены продукта
- `description: HTMLElement` - DOM элемент описание продукта
- `button?: HTMLButtonElement` - DOM элемент кнопки в карточке продукта

Конструктор класса: 
- `blockName` - имя блока 
- `HTMLElement` - DOM элемент карточки товара 
- `ICardActions` - действия с карточкой

Методы класса:
- `set id` - устанавливает  Id товара
- `set Image` - устанавливает картинку товара
- `set title` - устанавливает название товара
- `set category` - устанавливает категорию товара
- `set price` -  устанавливает цену товара
- `set description` -  устанавливает описание товара
- `set button` - устанавливает название кнопки
- `set selected` - блокирует кнопку если товар уже в корзине
  
### class CardPreview 
Класс наследуется от класса Card. Класс описывает карточку товара при открытии в модальном окне. 
Поле класса:
- `description: HTMLElement` - DOM элемент описания карточки товара.

Конструктор класса
- `container: HTMLElement` -  DOM элемент карточки товара 
- `actions?: ICardActions` - действия с карточкой

Метод класса:
- `set description(value: string)` - устанавливает описание товара
  
### class ProductItemBasket 
Класс наследуется от базового класса Component. Класс отражает информацию о товаре в корзине, его названии, стоимости и индексе. 
Поля класса:
- `index: HTMLElement` - DOM элемент индекса товара в корзине
- `title: HTMLElement` - DOM элемент названия товара
- `price: HTMLElement` - DOM элемент стоимости товара
- `button: HTMLButtonElement` - DOM элемент кнопки удалить товар из корзины
  
Конструктор класса: 
- `blockName: string` - имя блока
- `container: HTMLElement`- DOM элемент компонента корзины

Методы класса:
- `set title(value: string)` - отражает название товара в корзине
- `set index(value: number)` - отражает индекс товара в корзине
- `set price(value: number)` - отражает стомости товара в корзине

### class Basket 
Класс наследуется от базового класса Component и расширяется интерфейсом IBasket. Отвечает за работу с корзиной, отражает информацию по товарам в корзине, стоимости каждой единицы товара, дает возможность удалить товар из корзины, считает и показывает общую сумму заказа. 
Поля класса:
- `list: HTMLElement` - DOM элемент списка товаров в корзине
- `total: HTMLElement` - DOM элемент общей стоимости товаров в корзине
- `button: HTMLButtonElement` - DOM элемент кнопки корзины оформления заказа
  
Конструктор класса: 
- `blockName` - имя блока
- `container`- DOM элемент компонента корзины
- `events` - ссылка на менеджер событий для управления товарами в корзине

Методы класса:
- `set total` - отражает итоговую стоимость товаров в корзине
- `set list` - отражает содержимое корзины
- `disableButton` - блокирует кнопку "оформить" в пустой корзине
- `updateIndices` - определяет индекс товара в корзине

### class Modal
Класс наследуется от базового класса Component и расширяется интерфейсом IModal. Отвечает за работу с модальными окнами. 
Поля класса:
- `closeButton: HTMLButtonElement` - DOM элемент кнопки закрытия модального окна
- `content: HTMLElement` - DOM элемент с информацией 

Конструктор класса:
- `container: HTMLFormElement` - DOM элемент компонента модального окна
- `events: IEvents`- ссылка на менеджер событий

Методы класса:
- `set content` - определяет содержимое модального окна
- `open` - открытие модально окна
- `close` - закрытие модального окна
- `render` - определяет вид формы

### class Form`<T>`
Класс наследуется от базового класса Component и расширяется интерфейсом IFormState. Отвечает за работу с формой заказа. 
Поля класса:
- `submit: HTMLButtonElement` - DOM элемент кнопки отправки формы
- `errors: HTMLElement` - DOM элемент отображения ошибки валидации формы

Конструктор класса:
- `container: HTMLFormElement` - DOM элемент компонента формы
- `events: IEvents`- ссылка на менеджер событий

Методы класса:
- `onInputChange` - обрабатывает изменения в полях формы
- `valid` - определяет доступность кнопки
- `errors` - сообщает об ощибке
- `render` - определяет вид формы

### class OrderForm 
Класс наследуется от базового класса Form и расширяется интерфейсом IOrderForm. Класс описывает форму оплаты товара при оформлении заказа.

Поля класса:
- `card: HTMLButtonElement` - DOM элемент оплаты заказа картой
- `cash: HTMLButtonElement` -  DOM элемент оплаты заказа при получении
- `address: HTMLInputElement` -  DOM элемент адреса доставки

Конструктор класса: 
- `blockName: string` - имя блока
- `container:` DOM - элемент формы оплаты
- `events` - ссылка на менеджер событий
  
Метод класса:
- `clear()`- удаляет информацию из полей формы

### class ContactsForm 
Класс наследуется от базового класса Form и расширяется интерфейсом IContactsForm. Класс описывает форму ввода контактных данных.
Конструктор класса: 
- `container: HTMLFormElement` - DOM элемент формы с контактными данными
- `events` - ссылка на менеджер событий
  
Метод класса:
- `clear()`- удаляет информацию из полей формы
  
### class SuccessForm 
Класс наследуется от базового класса Component. Класс описывает форму подтверждения заказа.
Поля класса:
- `button: HTMLButtonElement` - DOM элемент кнопки закрытия "За новыми покупками"
- `description: HTMLElement` - DOM элемент компонента модального окна
   
Конструктор класса: 
- `blockName: string` - имя блока
- `container: HTMLElement` - DOM элемент формы оформленного заказа
- `actions?` - действия с формой заказа
  
Метод класса:
- `set description`- устанавливает описание общей стоимости заказа

### Список всех событий

- `catalog:changed` - изменение продуктов в каталоге
- `card:select` - выбор карточки из каталона
- `card:addToBasket` - добавить товар в корзину
- `modal:open` - открыть модальное окно
- `modal:close` - закрыть модальное окно
- `basket:open` - открытие окна корзины
- `basket:removeFromBasket` - удалить товары из корзины
- `basket:order` - переход в форму оформление заказа
- `order:submit` - показываем компонент формы ввода контактных данных
- `orderInput:change` - событие изменения данных в поле ввода
- `orderFormErrors:change` - событие для вывода ошибки валидации ввода данных в форму оплаты заказа
- `contactsFormErrors:change` - событие для вывода ошибки валидации ввода данных в форму контактных данных
- `contacts:submit` - событие создает заказ по API и очищает данные корзины и форм оформления заказа
- `order:success`- после создания заказа показывает компонент об успешной покупке







