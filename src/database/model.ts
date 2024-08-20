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
	details: string;
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
