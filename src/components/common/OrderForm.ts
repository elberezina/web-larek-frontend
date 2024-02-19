import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class OrderForm extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		this._address = container.elements.namedItem('address') as HTMLInputElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}

	clear() {
		this._card.classList.remove('button_alt-active');
		this._cash.classList.remove('button_alt-active');
		this._address.value = '';
	}
}
