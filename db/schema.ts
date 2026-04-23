// db/schema.ts
import * as SQLite from 'expo-sqlite';
import { seedingOperations } from './seeding';

export function setupSchema(db: SQLite.SQLiteDatabase) {
    db.execAsync(seedingOperations);
}
