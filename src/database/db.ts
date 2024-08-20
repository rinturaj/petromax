import Dexie, { type EntityTable } from 'dexie';
import type { CreditModel, Expenses, Nosil, Price, Staff, Stock, UserAccount } from './model';
import { browser } from '$app/environment';
import 'dexie-observable';

const db = new Dexie('petromax') as Dexie & {
	userAccount: EntityTable<UserAccount, 'id'>;
	price: EntityTable<Price, 'id'>;
	staff: EntityTable<Staff, 'id'>;
	nosil: EntityTable<Nosil, 'id'>;
	stock: EntityTable<Stock, 'id'>;
	expenses: EntityTable<Expenses, 'id'>;
	credit: EntityTable<CreditModel, 'id'>;
};

// Schema declaration:
db.version(1).stores({
	userAccount: '++id, email, name, password,[email+password]',
	staff: '++id, name, status',
	price: '++id, petrol,deisel',
	nosil: '++id, type, name,[type+name]',
	stock: '++id, stockDate, type,[stockDate+type]',
	expenses: '++id, title, createdOn',
	credit: '++id, vehicle, phoneNumber,[vehicle+type],createdOn'
});

db.transaction('rw', db.price, function (price) {
	console.log('wrote');
});

db.on('changes', function (changes) {
	changes.forEach(function (change) {
		switch (change.type) {
			case 1: // CREATED
				console.log('An object was created: ' + JSON.stringify(change.obj), change.table);
				break;
			case 2: // UPDATED
				console.log(
					'An object with key ' +
						change.key +
						' was updated with modifications: ' +
						JSON.stringify(change.mods),
					change.table
				);
				break;
			case 3: // DELETED
				console.log('An object was deleted: ' + JSON.stringify(change.oldObj));
				break;
		}
	});
});

export const persist = async () => {
	if (browser) {
		console.log('setting persistence...');
		return (await navigator.storage) && navigator.storage.persist && navigator.storage.persist();
	}
	return {};
};

export const isStoragePersisted = async () => {
	if (browser) {
		console.log('checking persistence...');
		return (
			(await navigator.storage) && navigator.storage.persisted && navigator.storage.persisted()
		);
	}
	return {};
};
export { db };
