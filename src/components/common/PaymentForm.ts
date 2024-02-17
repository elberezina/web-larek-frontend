import { IPaymentForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class PaymentForm extends Form<IPaymentForm> {
	protected _card: HTMLButtonElement;
	protected _onReceipt: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);
	}
}
