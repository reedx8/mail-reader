// db/schema.ts
import * as SQLite from 'expo-sqlite';
import { seedingOperations } from './seeding';
// import { testSeeding } from './seeding';

export function setupSchema(db: SQLite.SQLiteDatabase) {
    db.execAsync(seedingOperations);
    // db.execAsync(testSeeding);
}
