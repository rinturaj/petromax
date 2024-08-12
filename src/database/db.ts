import Dexie, { type EntityTable } from 'dexie';
import type { Nosil, Price, Staff, Stock, UserAccount } from './model';

const db = new Dexie('petromax') as Dexie & {
	userAccount: EntityTable<UserAccount, 'id'>;
	price: EntityTable<Price, 'id'>;
	staff: EntityTable<Staff, 'id'>;
	nosil: EntityTable<Nosil, 'id'>;
	stock: EntityTable<Stock, 'id'>;
};

// Schema declaration:
db.version(1).stores({
	userAccount: '++id, email, name, password,[email+password]',
	staff: '++id, name, status',
	price: '++id, petrol,deisel',
	nosil: '++id, type, name,[type+name]',
	stock: '++id, stockDate, type,[stockDate+type]'
});

export { db };
