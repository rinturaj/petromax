import { toNumber } from '../lib/utils';

export interface UserAccount {
	id: number;
	name: string;
	email: string;
	password: string;
}

export interface CreditModel {
	id?: number;
	vehicle: string;
	phoneNumber: string;
	amount: number;
	note: string;
	name: string;
	type: string;
	createdOn: Date;
}

export interface Oil {
	id?: number;
	name: string;
	size: string;
	quantity: number;
	unitPrice: number;
	createdOn: Date;
}
export interface Expenses {
	id?: number;
	title: string;
	note: string;
	amount: number;
	createdOn: Date;
}

export interface Price {
	id: number;
	petrol: number;
	diesel: number;
	updatedOn: Date;
}

export interface Nosil {
	id?: number;
	name: string;
	reading: number;
	type: string;
}
export interface Staff {
	id?: number;
	name: string;
	hourlyPrice: number;
	createdOn: Date;
	status: boolean;
}

export interface Stock {
	id?: number;
	openingStock: number;
	dipStock: number;
	closingStock: number;
	type: string;
	createdOn: Date;
	stockDate: Date;
}

export interface Readings {
	nosil: string;
	openingReadings: number;
	closingReadings: number;
	testLiter: number;
	totalLitre: number;

	type: string;
	unitPrice: number;

	grossTotalLitre: number;
	totalPrice: number;

	build(): Readings;
}

export class Reading implements Readings {
	nosil: string = '';
	openingReadings: number = 0;
	closingReadings: number = 0;
	testLiter: number = 0;
	totalLitre: number = 0;
	type: string = '';
	unitPrice: number = 0;
	grossTotalLitre: number = 0;
	totalPrice: number = 0;

	constructor() {}

	build() {
		this.totalLitre = toNumber(this.closingReadings - this.openingReadings);
		this.grossTotalLitre = toNumber(this.totalLitre - this.testLiter);
		this.totalPrice = toNumber(this.grossTotalLitre * this.unitPrice);
		return this;
	}
}

export interface OliSalesModel {
	id?: number;

	salesDate: Date;
	createdOn: Date;

	items: OilItem[];

	employeeName: string;
	employeeId: number;

	//collection
	byCash: number;
	upiPayment: number;
	card: number;
	hpPay: number;
	credit: number;

	totalCollection: number;
	inHand: number;
	actuals: number;

	discrepancy: number;
}

export class OliSalesModelClass implements OliSalesModel {
	id?: number = undefined;
	salesDate: Date = new Date();
	createdOn: Date = new Date();
	items: OilItem[] = [];
	employeeName: string = '';
	employeeId: number = 0;
	byCash: number = 0;
	upiPayment: number = 0;
	card: number = 0;
	hpPay: number = 0;
	credit: number = 0;
	totalCollection: number = 0;
	inHand: number = 0;
	actuals: number = 0;
	discrepancy: number = 0;
}
export interface OilItem {
	build(): OilItem;
	name: string;
	quantity: number;
	unit: number;
	unitPrice: number;
	amount: number;
}
export class OilItemClass implements OilItem {
	build(): OilItem {
		this.amount = toNumber(this.quantity * this.unitPrice);
		return this;
	}
	name: string = '';
	quantity: number = 0;
	unit: number = 0;
	unitPrice: number = 0;
	amount: number = 0;
}
export interface SaleModel {
	id?: number;

	salesDate: Date;
	createdOn: Date;

	petrolPrice: number;
	dieselPrice: number;

	employeeName: string;
	employeeId: number;

	checkIn: string;
	checkOut: string;
	totalHours: number;

	readings: Readings[];

	//collection
	byCash: number;
	upiPayment: number;
	card: number;
	hpPay: number;
	credit: number;

	totalCollection: number;
	inHand: number;
	actuals: number;

	discrepancy: number;
	isValid(): boolean;
}

export class SaleOrder implements SaleModel {
	id?: number = 0;
	salesDate: Date = new Date();
	createdOn: Date = new Date();
	petrolPrice: number = 0;
	dieselPrice: number = 0;
	employeeName: string = '';
	employeeId: number = 0;
	checkIn: string = '';
	checkOut: string = '';

	readings: Readings[] = [];
	byCash: number = 0;
	upiPayment: number = 0;
	card: number = 0;
	hpPay: number = 0;
	credit: number = 0;
	totalCollection: number = 0;
	inHand: number = 0;
	actuals: number = 0;
	discrepancy: number = 0;
	totalHours: number = 0;

	constructor() {}
	isValid(): boolean {
		return (
			this.actuals > 0 &&
			this.readings.length > 0 &&
			!!this.checkIn &&
			!!this.checkOut &&
			this.employeeId > 0 &&
			this.totalCollection > 0
		);
	}
}

export interface SalesRecord {
	denomination: number;
	type: 'coins' | 'notes';
	quantity: number;
	totalValue: number;
}

export interface SalesSummary {
	id?: number;
	createdOn: Date;
	records: SalesRecord[];
	total: number;
	totalCollectionReceived: number;
	totalSaleInHand: number;
	card: number;
	upi: number;
	credit: number;
	hpPay: number;
	cash: number;
	excessInHand: number;
	creditReceived: number;
	balance: number;
}

export class SalesSummaryClass implements SalesSummary {
	id?: number;
	createdOn: Date;
	records: SalesRecord[];
	total: number;
	totalSaleInHand: number;
	card: number;
	upi: number;
	totalCollectionReceived: number;
	credit: number;
	hpPay: number;
	cash: number;
	excessInHand: number;
	creditReceived: number;
	balance: number;
	constructor() {
		this.createdOn = new Date();
		this.records = this.generateRecoders();
		this.total = 0;
		this.totalSaleInHand = 0;
		this.totalCollectionReceived = 0;
		this.card = 0;
		this.upi = 0;
		this.credit = 0;
		this.hpPay = 0;
		this.cash = 0;
		this.excessInHand = 0;
		this.creditReceived = 0;
		this.balance = 0;
	}

	generateRecoders(): SalesRecord[] {
		return [
			{ type: 'notes', denomination: 500, quantity: 0, totalValue: 0 },
			{ type: 'notes', denomination: 200, quantity: 0, totalValue: 0 },
			{ type: 'notes', denomination: 100, quantity: 0, totalValue: 0 },
			{ type: 'notes', denomination: 50, quantity: 0, totalValue: 0 },
			{ type: 'notes', denomination: 20, quantity: 0, totalValue: 0 },
			{ type: 'notes', denomination: 10, quantity: 0, totalValue: 0 },
			{ type: 'coins', denomination: 10, quantity: 0, totalValue: 0 },
			{ type: 'coins', denomination: 5, quantity: 0, totalValue: 0 },
			{ type: 'coins', denomination: 2, quantity: 0, totalValue: 0 },
			{ type: 'coins', denomination: 1, quantity: 0, totalValue: 0 }
		];
	}
	// Helper method to calculate total from records
	calculateTotal(): void {
		this.total = this.records.reduce((sum, record) => sum + record.totalValue, 0);
	}

	// Helper method to calculate excess in hand
	calculateExcessInHand(): void {
		this.excessInHand = this.totalSaleInHand - this.total - this.hpPay + this.creditReceived;
	}
}
