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
