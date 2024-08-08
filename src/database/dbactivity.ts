import { db } from './db';

export class LoginApi {
	static async login(email: string, password: string) {
		let user = await db.userAccount.where({ email: email, password: password }).first();
		console.log(user);

		if (!!user) {
			return true;
		}

		return false;
	}
}
