// db/index.ts
import * as SQLite from 'expo-sqlite';
import { setupSchema } from './schema';

// const db = await SQLite.openDatabaseAsync('usps_data.db');
const db = SQLite.openDatabaseSync('mail-reader.db');
setupSchema(db);

export { db };
