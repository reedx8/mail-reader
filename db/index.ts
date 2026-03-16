// db/index.ts
import * as SQLite from 'expo-sqlite';
import { setupSchema } from './schema';

const db = SQLite.openDatabaseSync('mail-reader.db');
setupSchema(db);

export { db };
