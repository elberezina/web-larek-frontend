import { Model } from '../base/Model';
import { IAppState, IOrder, IProduct } from '../../types';

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	status: boolean;
	price: number;
}

// Класс хранит состояние приложения
export class AppState extends Model<IAppState> {
	basket: Product[] = [];
	catalog: Product[] = [];
	order: IOrder = null;

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	addToBasket(product: Product) {
		this.basket.push(product);
	}

	removeFromBasket(product: Product) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
	}
}
