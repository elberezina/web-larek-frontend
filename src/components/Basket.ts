import { IBasket, IProductInBasket } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._total = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}

	set total(price: number) {
		this._total.textContent = price + ' синапсов';
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this._button.disabled = items.length ? false : true;
	}

	disableButton() {
		this._button.disabled = true;
	}

	updateIndices() {
		Array.from(this._list.children).forEach((item, index) => {
			const indexInItem = item.querySelector(`.basket__item-index`);
			if (indexInItem) {
				indexInItem.textContent = (index + 1).toString();
			}
		});
	}
}

export interface IProductItemBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductItemBasket extends Component<IProductInBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IProductItemBasketActions
	) {
		super(container);
		this._title = container.querySelector(`.${blockName}__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set price(value: number) {
		this._price.textContent = value + ' синапсов';
	}
}
