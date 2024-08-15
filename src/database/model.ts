export interface UserAccount {
	id: number;
	name: string;
	email: string;
	password: string;
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
	id: number;
	openingStock: number;
	dipStock: number;
	closingStock: number;
	type: string;
	createdOn: Date;
	stockDate: Date;
}
