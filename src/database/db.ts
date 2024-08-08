import Dexie, { type EntityTable } from 'dexie';
import type { UserAccount } from './model';

const db = new Dexie('petromax') as Dexie & {
	userAccount: EntityTable<
		UserAccount,
		'id' // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	userAccount: '++id, email, name, password,[email+password]' // primary key "id" (for the runtime!)
});

export type { UserAccount };
export { db };
