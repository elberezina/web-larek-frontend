import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { LarekAPI } from './components/LarekAPI';
import { Card, CardPreview } from './components/Card';
import { AppState, Product } from './components/AppState';
import { Modal } from './components/common/Modal';
import { Basket, ProductItemBasket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import {
	IContactsForm,
	IOrderForm,
	IOrderResult,
	IOrderValidate,
} from './types';
import { ContactsForm } from './components/ContactsForm';
import { SuccessForm } from './components/SuccessForm';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(
	'order',
	cloneTemplate(orderFormTemplate),
	events
);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successForm = new SuccessForm(
	'order-success',
	cloneTemplate(successTemplate),
	{
		onClick: () => modal.close(),
	}
);

events.on('catalog:changed', () => {
	page.catalog = appData.catalog.map((product) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});
		return card.render({
			title: product.title,
			image: product.image,
			price: product.price,
			category: product.category,
		});
	});
});

events.on('card:select', (product: Product) => {
	page.locked = true;
	const productItemPreview = new CardPreview(
		cloneTemplate(cardPreviewTemplate),
		{
			onClick: () => {
				if (product.selected) {
					events.emit('basket:removeFromBasket', product);
				} else {
					events.emit('card:addToBasket', product);
				}
				productItemPreview.updateButton(product.selected);
			},
		}
	);
	modal.render({
		content: productItemPreview.render({
			id: product.id,
			title: product.title,
			image: product.image,
			category: product.category,
			description: product.description,
			price: product.price,
			selected: product.selected,
		}),
	});
});

events.on('card:addToBasket', (product: Product) => {
	appData.addToBasket(product);
	product.selected = true;
	page.counter = appData.getCountProductInBasket();
});

events.on('basket:removeFromBasket', (product: Product) => {
	appData.removeFromBasket(product);
	product.selected = false;
	basket.total = appData.getTotalBasketPrice();
	page.counter = appData.getCountProductInBasket();
	basket.updateIndices();
	if (appData.getCountProductInBasket() == 0) {
		basket.toggleButton(true);
	}
});

events.on('basket:open', () => {
	page.locked = true;
	const basketItems = appData.basket.map((item, index) => {
		const productItem = new ProductItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:removeFromBasket', item),
			}
		);
		return productItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			total: appData.getTotalBasketPrice(),
		}),
	});
});

events.on('basket:order', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.log(error);
	});

events.on('modal:close', () => {
	page.locked = false;
});

events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderFields(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IOrderValidate>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasketPrice();
	appData.addProductsToOrder();
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
		}),
	});
});

events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.createOrder(appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.clearOrder();
			page.counter = 0;
			appData.resetSelected();
			orderForm.clear();
			contactsForm.clear();
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('order:success', (res: IOrderResult) => {
	modal.render({
		content: successForm.render({
			description: res.total,
		}),
	});
});
