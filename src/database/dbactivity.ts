import { role } from '../lib/component.store';
import { db } from './db';

export class LoginApi {
	static async login(email: string, password: string) {
		if (email == 'root' && password == 'petrol321#') {
			role.set('root');
			return true;
		}
		let admin = await db.userAccount.get(1);
		if (admin == null) {
			await db.userAccount.add({
				id: 1,
				email: 'admin',
				password: '1122',
				name: 'admin'
			});
		}

		let user = await db.userAccount.where({ email: email, password: password }).first();
		console.log(user);

		if (!!user) {
			role.set('admin');
			return true;
		}

		return false;
	}
}

export class PriceApi {
	static async add(petrol: number, deisel: number) {
		let result = await db.price.put({
			id: 1,
			diesel: deisel,
			petrol: petrol,
			updatedOn: new Date()
		});
		return result;
	}
}
