import { db } from '../database/db';
import { importStatus } from './component.store';

export class DataImport {
	static async import(file: File) {
		console.log(file);

		const json = await DataImport.readFile(file);
		console.log(json);

		const keys = Object.keys(json);
		console.log(keys);
		let progress = 0;

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let value = JSON.parse(JSON.stringify(json[key]));
			console.log(value);

			const keysplit = key.split('-');
			const id = Number(keysplit.pop());
			const table = keysplit.pop();
			value = { ...value, id };
			console.log(value, keysplit, table, id);

			progress = ((i + 1) * 100) / keys.length;

			importStatus.set(progress);
			switch (table) {
				case 'staff':
					value.createdOn = new Date(value.createdOn);
					await db.staff.put(value);
					break;
				case 'nosil':
					await db.nosil.put(value);
					break;
				case 'price':
					value.updatedOn = new Date(value.updatedOn);

					await db.price.put(value);
					break;
				case 'stock':
					value.stockDate = new Date(value.stockDate);
					value.createdOn = new Date(value.createdOn);
					await db.stock.put(value);
					break;
				case 'expenses':
					value.createdOn = new Date(value.createdOn);
					await db.expenses.put(value);
					break;
				case 'credit':
					value.createdOn = new Date(value.createdOn);
					await db.credit.put(value);
					break;
				case 'sales':
					value.salesDate = new Date(value.salesDate);
					value.createdOn = new Date(value.createdOn);
					await db.sales.put(value);
					break;
				case 'oil':
					value.createdOn = new Date(value.createdOn);

					await db.oil.put(value);
					break;
				case 'oilsales':
					value.salesDate = new Date(value.salesDate);
					value.createdOn = new Date(value.createdOn);
					await db.oilsales.put(value);
					break;
			}
		}
		return 100; // Return 100% when all keys are processed
	}

	static readFile(file: File): Promise<any> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e: any) => resolve(JSON.parse(e.target.result));
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}
}
