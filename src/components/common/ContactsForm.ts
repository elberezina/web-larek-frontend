import { IContactsForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../base/Form';

export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}
